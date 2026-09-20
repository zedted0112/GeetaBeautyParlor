import { supabase } from './supabase'
import { readLocalProfile } from './profile'

export const REACTION_KINDS = ['fire', 'heart', 'wow', 'eyes']

export const REACTION_EMOJI = {
  fire: '🔥',
  heart: '❤️',
  wow: '😮',
  eyes: '😍',
}

export const emptyTally = (picked = null) => ({
  fire: 0,
  heart: 0,
  wow: 0,
  eyes: 0,
  picked,
})

export const emptyTallies = (photoIds) =>
  Object.fromEntries(photoIds.map((id) => [id, emptyTally()]))

const toTallies = (rows, photoIds, visitorId) => {
  const next = emptyTallies(photoIds)
  rows.forEach((row) => {
    const tally = next[row.photo_id]
    if (!tally || !REACTION_KINDS.includes(row.kind)) return
    tally[row.kind] += 1
    if (row.visitor_id === visitorId) tally.picked = row.kind
  })
  return next
}

export const loadTallies = async (photoIds, visitorId) => {
  const { data, error } = await supabase.from('reaction_votes').select('photo_id, visitor_id, kind')
  if (error) throw error
  return toTallies(data || [], photoIds, visitorId)
}

export const saveVote = async (photoId, visitorId, kind, previous) => {
  if (previous === kind) {
    const { error } = await supabase.from('reaction_votes').delete().match({ photo_id: photoId, visitor_id: visitorId })
    if (error) throw error
    return
  }

  const { error } = await supabase.from('reaction_votes').upsert(
    { photo_id: photoId, visitor_id: visitorId, kind, updated_at: new Date().toISOString() },
    { onConflict: 'photo_id,visitor_id' }
  )
  if (error) throw error
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

const stampVote = (value) => {
  const time = value ? new Date(value).getTime() : 0
  return Number.isFinite(time) ? time : 0
}

const hydrateReactionRows = async (rows) => {
  if (!rows.length) return []
  const ids = [...new Set(rows.map((row) => row.visitor_id))]
  const { data: profiles } = await supabase.from('parlor_profiles').select('visitor_id, name, avatar').in('visitor_id', ids)
  const byId = Object.fromEntries((profiles || []).map((row) => [row.visitor_id, row]))

  return rows.map((row) => ({
    id: `${row.visitor_id}:${row.photo_id}:${row.updated_at || ''}`,
    photoId: row.photo_id,
    visitorId: row.visitor_id,
    kind: row.kind,
    at: row.updated_at,
    name: byId[row.visitor_id]?.name || 'Someone',
    avatar: byId[row.visitor_id]?.avatar || 'lotus',
  }))
}

export const loadReactionFeed = async ({ excludeVisitorId = '' } = {}) => {
  const { data: votes, error } = await supabase
    .from('reaction_votes')
    .select('photo_id, visitor_id, kind, updated_at')
    .order('updated_at', { ascending: false })
    .limit(80)
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

  const { data: votes, error } = await supabase
    .from('reaction_votes')
    .select('photo_id, visitor_id, kind, updated_at')
    .in('photo_id', photoIds)
    .order('updated_at', { ascending: false })
    .limit(200)
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
  const { data: votes, error } = await supabase
    .from('reaction_votes')
    .select('visitor_id, kind, updated_at')
    .eq('photo_id', photoId)
    .order('updated_at', { ascending: false })
    .limit(8)
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
      name: isYou ? 'You' : name,
      avatar: isYou ? local?.avatar || saved?.avatar : saved?.avatar,
      isYou,
    }
  })
}
