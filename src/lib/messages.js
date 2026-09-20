import { supabase } from './supabase'
import { GEETA_ADMIN_ID } from './profile'

const makeId = () => {
  try {
    if (globalThis.crypto?.randomUUID) return crypto.randomUUID()
  } catch {
    // fall through
  }
  const bytes = new Uint8Array(16)
  globalThis.crypto.getRandomValues(bytes)
  bytes[6] = (bytes[6] & 0x0f) | 0x40
  bytes[8] = (bytes[8] & 0x3f) | 0x80
  const hex = [...bytes].map((byte) => byte.toString(16).padStart(2, '0')).join('')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}

export const BOOKING_STATUS = {
  pending: 'Asked',
  accepted: 'Confirmed',
  rejected: 'Declined',
  rescheduled: 'New time',
}

const COLS_FULL = 'id, from_visitor_id, from_name, from_avatar, kind, ref_id, visit_on, visit_time, service, body, parent_id, status, created_at'
const COLS_PARENT = 'id, from_visitor_id, from_name, from_avatar, kind, ref_id, visit_on, service, body, parent_id, created_at'
const COLS_LEGACY = 'id, from_visitor_id, from_name, from_avatar, kind, ref_id, visit_on, service, body, created_at'

const schemaError = (error) => /parent_id|status|visit_time|schema cache/i.test(error?.message || '')

const normalize = (rows) =>
  (rows || []).map((row) => ({
    ...row,
    parent_id: row.parent_id || null,
    status: row.status || (row.kind === 'book' ? 'pending' : ''),
    visit_time: row.visit_time || '',
  }))

const threadCache = new Map()
let listCache = null

const bustList = () => {
  listCache = null
}

export const peekThread = (id) => (id && threadCache.get(id)) || null

export const rememberThread = (id, rows) => {
  if (!id || !rows?.length) return rows || []
  threadCache.set(id, rows)
  return rows
}

const fetchMessages = async (fresh = false) => {
  if (!fresh && listCache) return listCache
  for (const cols of [COLS_FULL, COLS_PARENT, COLS_LEGACY]) {
    const { data, error } = await supabase.from('parlor_messages').select(cols).order('created_at', { ascending: false }).limit(120)
    if (!error) {
      listCache = normalize(data)
      return listCache
    }
    if (!schemaError(error)) throw new Error(error.message)
  }
  return listCache || []
}

const isRoot = (row) => row.kind !== 'reply' && !row.parent_id

const withLastReply = (roots, replies) => {
  const lastByParent = {}
  for (const row of replies || []) {
    const parentId = row.parent_id
    if (!parentId) continue
    if (!lastByParent[parentId] || row.created_at > lastByParent[parentId].created_at) {
      lastByParent[parentId] = row
    }
  }
  return (roots || []).map((row) => ({ ...row, lastReply: lastByParent[row.id] || null }))
}

const insertRow = async (row) => {
  let payload = row
  let { error } = await supabase.from('parlor_messages').insert(payload)
  if (error && schemaError(error)) {
    const { status, visit_time, ...rest } = payload
    payload = rest
    ;({ error } = await supabase.from('parlor_messages').insert(payload))
  }
  if (error) {
    if (schemaError(error)) throw new Error('Replies need a one-time studio update. Run the chat SQL, then send again.')
    throw new Error(error.message || 'Could not send')
  }
  bustList()
}

export const seedGeetaAdmin = async () => {
  await supabase.rpc('parlor_seed_geeta')
}

export const sendToGeeta = async (payload) => {
  const name = String(payload.name || '').trim()
  if (name.length < 2) throw new Error('Join the parlor first')
  if (String(payload.visitorId || '') === GEETA_ADMIN_ID) throw new Error('This desk receives client notes')
  await insertRow({
    id: makeId(),
    from_visitor_id: payload.visitorId || 'anon',
    from_name: name.slice(0, 24),
    from_avatar: payload.avatar || 'lotus',
    kind: payload.kind,
    ref_id: payload.refId || '',
    visit_on: payload.date || null,
    visit_time: payload.time || '',
    service: String(payload.service || '').slice(0, 80),
    body: String(payload.body || '').trim().slice(0, 280),
    parent_id: null,
    status: payload.kind === 'book' ? 'pending' : '',
  })
}

export const replyOnThread = async ({ parentId, visitorId, name, avatar, body, refId = '' }) => {
  const note = String(body || '').trim()
  if (note.length < 1) throw new Error('Write a reply')
  const who = String(name || '').trim()
  if (who.length < 2) throw new Error('Join the parlor first')

  await insertRow({
    id: makeId(),
    from_visitor_id: visitorId || 'anon',
    from_name: who.slice(0, 24),
    from_avatar: avatar || 'lotus',
    kind: 'reply',
    ref_id: refId,
    body: note.slice(0, 280),
    parent_id: parentId,
  })
}

export const decideBooking = async ({ root, visitorId, name, avatar, status, date, time, note }) => {
  if (!root?.id) throw new Error('Missing booking')
  const nextDate = date || root.visit_on
  const nextTime = time != null ? time : root.visit_time || ''
  const patch = { status, visit_on: nextDate, visit_time: nextTime }
  const { error } = await supabase.from('parlor_messages').update(patch).eq('id', root.id)
  if (error) {
    if (schemaError(error) || /policy|permission|update/i.test(error.message || '')) {
      throw new Error('Booking decisions need a one-time studio update. Run the SQL, then try again.')
    }
    throw new Error(error.message || 'Could not update booking')
  }
  bustList()
  const cached = threadCache.get(root.id)
  if (cached) {
    rememberThread(
      root.id,
      cached.map((row) => (row.id === root.id ? { ...row, ...patch } : row))
    )
  }

  const when = [nextDate, nextTime].filter(Boolean).join(' · ')
  const copies = {
    accepted: when ? `Confirmed for ${when}.` : 'This booking is confirmed.',
    rejected: "This date doesn't work. Let's pick another.",
    rescheduled: when ? `Moved to ${when}.` : 'The booking time has changed.',
  }
  const extra = String(note || '').trim()
  const body = extra ? `${copies[status] || copies.accepted} ${extra}` : copies[status] || copies.accepted
  await replyOnThread({
    parentId: root.id,
    visitorId,
    name,
    avatar,
    body,
    refId: root.ref_id,
  })
  return { ...root, ...patch }
}

export const loadThread = async (root, { fresh = false } = {}) => {
  if (!root?.id) return []
  if (!fresh) {
    const hit = threadCache.get(root.id)
    if (hit?.length) return hit
  }
  for (const cols of [COLS_FULL, COLS_PARENT, COLS_LEGACY]) {
    const { data, error } = await supabase
      .from('parlor_messages')
      .select(cols)
      .or(`id.eq.${root.id},parent_id.eq.${root.id}`)
      .order('created_at', { ascending: true })
    if (!error) {
      const rows = normalize(data)
      return rememberThread(root.id, rows.length ? rows : [root])
    }
    if (!schemaError(error)) return rememberThread(root.id, [root])
  }
  return rememberThread(root.id, [root])
}

export const loadGeetaInbox = async ({ fresh = false } = {}) => {
  const rows = await fetchMessages(fresh)
  const roots = rows.filter(isRoot)
  const replies = rows.filter((row) => !isRoot(row))
  return withLastReply(roots, replies)
}

export const loadMyThreads = async (visitorId, { fresh = false } = {}) => {
  if (!visitorId || visitorId === 'anon') return []
  const rows = await fetchMessages(fresh)
  const mine = new Set(rows.filter((row) => row.from_visitor_id === visitorId && isRoot(row)).map((row) => row.id))
  const roots = rows.filter((row) => mine.has(row.id))
  const replies = rows.filter((row) => mine.has(row.parent_id))
  return withLastReply(roots, replies)
}
