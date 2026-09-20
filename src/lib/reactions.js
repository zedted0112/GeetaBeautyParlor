import { supabase } from './supabase'

export const REACTION_KINDS = ['fire', 'heart', 'wow', 'eyes']

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
