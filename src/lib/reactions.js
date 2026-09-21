import { supabase } from './supabase'
import { readLocalProfile } from './profile'

export const REACTION_KINDS = ['fire', 'heart', 'wow', 'eyes']

export const REACTION_EMOJI = {
  fire: '🔥',
  heart: '❤️',
  wow: '😮',
  eyes: '😍',
}

const hitsOf = (row) => Math.max(1, Number(row?.hits) || 1)

const stampVote = (value) => {
  const time = value ? new Date(value).getTime() : 0
  return Number.isFinite(time) ? time : 0
}

export const emptyTally = (picked = null) => ({
  fire: 0,
  heart: 0,
  wow: 0,
  eyes: 0,
  picked,
  mine: { fire: 0, heart: 0, wow: 0, eyes: 0 },
})

export const emptyTallies = (photoIds) =>
  Object.fromEntries(photoIds.map((id) => [id, emptyTally()]))

export const bumpTally = (row, kind) => ({
  ...row,
  [kind]: (row[kind] || 0) + 1,
  picked: kind,
  mine: { ...row.mine, [kind]: (row.mine?.[kind] || 0) + 1 },
})

export const bumpPresence = (rows, kind) => {
  const you = rows.find((row) => row.isYou && row.kind === kind)
  if (you) {
    return rows.map((row) => (row === you ? { ...row, hits: (row.hits || 1) + 1 } : row))
  }
  return [{ visitorId: 'you', kind, name: 'You', hits: 1, isYou: true }, ...rows]
}

const toTallies = (rows, photoIds, visitorId) => {
  const next = emptyTallies(photoIds)
  const ordered = [...rows].sort((a, b) => stampVote(a.updated_at) - stampVote(b.updated_at))
  ordered.forEach((row) => {
    const tally = next[row.photo_id]
    if (!tally || !REACTION_KINDS.includes(row.kind)) return
    const hits = hitsOf(row)
    tally[row.kind] += hits
    if (row.visitor_id === visitorId) {
      tally.picked = row.kind
      tally.mine[row.kind] += hits
    }
  })
  return next
}

const loadVoteRows = async (columns) => {
  const { data, error } = await supabase.from('reaction_votes').select(columns)
  if (error) throw error
  return data || []
}

export const loadTallies = async (photoIds, visitorId) => {
  try {
    return toTallies(await loadVoteRows('photo_id, visitor_id, kind, hits, updated_at'), photoIds, visitorId)
  } catch {
    return toTallies(await loadVoteRows('photo_id, visitor_id, kind, updated_at'), photoIds, visitorId)
  }
}

const writeVote = async (photoId, visitorId, kind, hits, conflict) => {
  const { error } = await supabase.from('reaction_votes').upsert(
    { photo_id: photoId, visitor_id: visitorId, kind, hits, updated_at: new Date().toISOString() },
    { onConflict: conflict }
  )
  return error
}

export const saveVote = async (photoId, visitorId, kind) => {
  const { error: rpcError } = await supabase.rpc('parlor_tap_reaction', {
    p_photo_id: photoId,
    p_visitor_id: visitorId,
    p_kind: kind,
  })
  if (!rpcError) return

  const { data: stacked } = await supabase
    .from('reaction_votes')
    .select('hits')
    .eq('photo_id', photoId)
    .eq('visitor_id', visitorId)
    .eq('kind', kind)
    .maybeSingle()

  const stackedError = await writeVote(photoId, visitorId, kind, stacked ? hitsOf(stacked) + 1 : 1, 'photo_id,visitor_id,kind')
  if (!stackedError) return

  const { data: single } = await supabase
    .from('reaction_votes')
    .select('kind, hits')
    .eq('photo_id', photoId)
    .eq('visitor_id', visitorId)
    .maybeSingle()

  const nextHits = single?.kind === kind ? hitsOf(single) + 1 : 1
  const { error } = await supabase.from('reaction_votes').upsert(
    {
      photo_id: photoId,
      visitor_id: visitorId,
      kind,
      hits: nextHits,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'photo_id,visitor_id' }
  )
  if (error) {
    const fallback = await supabase.from('reaction_votes').upsert(
      { photo_id: photoId, visitor_id: visitorId, kind, updated_at: new Date().toISOString() },
      { onConflict: 'photo_id,visitor_id' }
    )
    if (fallback.error) throw fallback.error
  }
}

export const subscribeTallies = (photoIds, visitorId, onChange) => {
  const channel = supabase
    .channel('reaction-votes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'reaction_votes' }, async () => {
      try {
        onChange(await loadTallies(photoIds, visitorId))
      } catch {
        // keep the last good counts if a refresh fails
      }
    })
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}

export const loadReactionVisitors = async () => {
  const { data, error } = await supabase.from('reaction_votes').select('visitor_id, updated_at')
  if (error) throw error
  const latest = {}
  ;(data || []).forEach((row) => {
    if (!row.visitor_id) return
    const time = row.updated_at ? new Date(row.updated_at).getTime() : 0
    latest[row.visitor_id] = Math.max(latest[row.visitor_id] || 0, Number.isFinite(time) ? time : 0)
  })
  return latest
}

export const loadVisitorVotes = async (visitorId) => {
  if (!visitorId) return []
  const { data, error } = await supabase
    .from('reaction_votes')
    .select('photo_id, kind, updated_at')
    .eq('visitor_id', visitorId)
    .order('updated_at', { ascending: false })
  if (error) throw error
  return data || []
}

const hydrateReactionRows = async (rows) => {
  if (!rows.length) return []
  const ids = [...new Set(rows.map((row) => row.visitor_id))]
  const { data: profiles } = await supabase.from('parlor_profiles').select('visitor_id, name, avatar').in('visitor_id', ids)
  const byId = Object.fromEntries((profiles || []).map((row) => [row.visitor_id, row]))

  return rows.map((row) => ({
    id: `${row.visitor_id}:${row.photo_id}:${row.kind}`,
    photoId: row.photo_id,
    visitorId: row.visitor_id,
    kind: row.kind,
    hits: hitsOf(row),
    at: row.updated_at,
    name: byId[row.visitor_id]?.name || 'Someone',
    avatar: byId[row.visitor_id]?.avatar || 'lotus',
  }))
}

const selectVotes = async (build) => {
  const withHits = await build('photo_id, visitor_id, kind, hits, updated_at')
  if (!withHits.error) return withHits
  return build('photo_id, visitor_id, kind, updated_at')
}

export const loadReactionFeed = async ({ excludeVisitorId = '' } = {}) => {
  const { data: votes, error } = await selectVotes((columns) =>
    supabase.from('reaction_votes').select(columns).order('updated_at', { ascending: false }).limit(80)
  )
  if (error) throw error
  const rows = (votes || []).filter((row) => row.visitor_id && row.visitor_id !== excludeVisitorId)
  return hydrateReactionRows(rows)
}

export const loadLikedReactionFeed = async (visitorId) => {
  if (!visitorId) return []
  const { data: mine, error: mineError } = await supabase
    .from('reaction_votes')
    .select('photo_id, updated_at')
    .eq('visitor_id', visitorId)
  if (mineError) throw mineError
  if (!mine?.length) return []

  const sinceByPhoto = Object.fromEntries(mine.map((row) => [row.photo_id, stampVote(row.updated_at)]))
  const photoIds = mine.map((row) => row.photo_id)

  const { data: votes, error } = await selectVotes((columns) =>
    supabase
      .from('reaction_votes')
      .select(columns)
      .in('photo_id', photoIds)
      .order('updated_at', { ascending: false })
      .limit(200)
  )
  if (error) throw error

  const rows = (votes || []).filter((row) => {
    if (!row.visitor_id || row.visitor_id === visitorId) return false
    return stampVote(row.updated_at) > (sinceByPhoto[row.photo_id] || 0)
  })

  return hydrateReactionRows(rows)
}

export const subscribeReactionFeed = (onChange, options = {}) => {
  const load = options.load || (() => loadReactionFeed(options))
  const channel = supabase
    .channel(`reaction-feed-${Date.now()}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'reaction_votes' }, async () => {
      try {
        onChange(await load())
      } catch {
        // keep the last good feed if a refresh fails
      }
    })
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}

export const loadPresence = async (photoId, visitorId) => {
  const { data: votes, error } = await selectVotes((columns) =>
    supabase
      .from('reaction_votes')
      .select(columns)
      .eq('photo_id', photoId)
      .order('updated_at', { ascending: false })
      .limit(8)
  )
  if (error) throw error
  if (!votes?.length) return []

  const ids = [...new Set(votes.map((row) => row.visitor_id))]
  const { data: profiles } = await supabase
    .from('parlor_profiles')
    .select('visitor_id, name, avatar, role')
    .in('visitor_id', ids)

  const byId = Object.fromEntries((profiles || []).map((row) => [row.visitor_id, row]))
  const local = readLocalProfile()

  return votes.map((row) => {
    const isYou = row.visitor_id === visitorId
    const saved = byId[row.visitor_id]
    const name = isYou ? local?.name || saved?.name || 'You' : saved?.name || 'Someone'
    return {
      visitorId: row.visitor_id,
      kind: row.kind,
      hits: hitsOf(row),
      name: isYou ? 'You' : name,
      avatar: isYou ? local?.avatar || saved?.avatar : saved?.avatar,
      isYou,
    }
  })
}
