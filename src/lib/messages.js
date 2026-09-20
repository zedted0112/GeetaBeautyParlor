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

const forgetThread = (id) => {
  if (id) threadCache.delete(id)
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

export const isChatThread = (row) => row?.kind === 'chat' || row?.ref_id === '__chat__'

export const isLiveChatThread = (row) => {
  if (!isChatThread(row)) return false
  return Boolean(String(row.body || '').trim() || String(row.lastReply?.body || '').trim())
}

export const isLookThread = (row) =>
  (row?.kind === 'look' && row?.ref_id !== '__chat__') || row?.kind === 'reel'

export const isBookThread = (row) => row?.kind === 'book'

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

const withoutDeviceTime = (row) => {
  const payload = { ...row }
  delete payload.created_at
  return payload
}

const readInserted = async (id, fallback) => {
  if (!id) return fallback
  const { data } = await supabase.from('parlor_messages').select(COLS_FULL).eq('id', id).maybeSingle()
  return data ? normalize([data])[0] : fallback
}

const hiddenKey = (visitorId) => `gbp-hidden-chats:${visitorId || 'anon'}`

const readLocalHidden = (visitorId) => {
  try {
    const raw = JSON.parse(window.localStorage.getItem(hiddenKey(visitorId)) || '[]')
    return new Set(Array.isArray(raw) ? raw.filter(Boolean) : [])
  } catch {
    return new Set()
  }
}

const writeLocalHidden = (visitorId, ids) => {
  try {
    window.localStorage.setItem(hiddenKey(visitorId), JSON.stringify([...ids]))
  } catch {
    // ignore quota / private mode
  }
}

const missingHideTable = (error) =>
  /schema cache|does not exist|relation|parlor_hidden_chats|PGRST/i.test(error?.message || '')

export const loadHiddenThreadIds = async (visitorId) => {
  const local = readLocalHidden(visitorId)
  if (!visitorId) return local
  const { data, error } = await supabase.from('parlor_hidden_chats').select('thread_id').eq('visitor_id', visitorId)
  if (error) return local
  const ids = new Set((data || []).map((row) => row.thread_id).filter(Boolean))
  writeLocalHidden(visitorId, ids)
  return ids
}

export const revealThread = async (threadId) => {
  if (!threadId) return
  try {
    const prefix = 'gbp-hidden-chats:'
    Object.keys(window.localStorage || {}).forEach((key) => {
      if (!key.startsWith(prefix)) return
      const who = key.slice(prefix.length)
      const ids = readLocalHidden(who)
      if (ids.delete(threadId)) writeLocalHidden(who, ids)
    })
  } catch {
    // keep going
  }
  const { error } = await supabase.from('parlor_hidden_chats').delete().eq('thread_id', threadId)
  if (error && !missingHideTable(error)) {
    // inbox can still refresh; hide may linger until SQL is run
  }
}

const insertRow = async (row) => {
  let payload = withoutDeviceTime(row)
  const write = (next) => supabase.from('parlor_messages').insert(withoutDeviceTime(next)).select().single()
  let { data, error } = await write(payload)
  if (error && schemaError(error)) {
    const { status, visit_time, created_at, ...rest } = payload
    payload = rest
    ;({ data, error } = await write(payload))
  }
  if (error) {
    if (schemaError(error)) throw new Error('Replies need a one-time studio update. Run the chat SQL, then send again.')
    throw new Error(error.message || 'Could not send')
  }
  const saved = await readInserted((data || payload).id, normalize([data || payload])[0])
  bustList()
  forgetThread(saved.parent_id || saved.id)
  await revealThread(saved.parent_id || saved.id)
  return saved
}

export const seedGeetaAdmin = async () => {
  await supabase.rpc('parlor_seed_geeta')
}

const WELCOME_PREFIX = 'Thank you for reaching out'

const firstName = (name) => String(name || '').trim().split(/\s+/)[0] || 'there'

const welcomeNote = (name) =>
  `${WELCOME_PREFIX}, ${firstName(name)}. Share your queries or just wanna chit chat?`

const visitorRootIds = (rows, visitorId) =>
  new Set(rows.filter((row) => row.from_visitor_id === visitorId && isRoot(row)).map((row) => row.id))

const hasWelcome = (rows, visitorId) => {
  const roots = visitorRootIds(rows, visitorId)
  return rows.some(
    (row) =>
      row.from_visitor_id === GEETA_ADMIN_ID &&
      roots.has(row.parent_id) &&
      String(row.body || '').startsWith(WELCOME_PREFIX)
  )
}

export const maybeAutoWelcome = async (root, visitorId, clientName) => {
  if (!root?.id || !visitorId || visitorId === 'anon' || visitorId === GEETA_ADMIN_ID) return null
  const rows = await fetchMessages(true)
  if (hasWelcome(rows, visitorId)) return null
  return replyOnThread({
    parentId: root.id,
    visitorId: GEETA_ADMIN_ID,
    name: 'Geeta',
    avatar: 'bloom',
    body: welcomeNote(clientName || root.from_name),
    refId: root.ref_id || '',
  })
}

export const sendToGeeta = async (payload) => {
  const name = String(payload.name || '').trim()
  if (name.length < 2) throw new Error('Join the parlor first')
  if (String(payload.visitorId || '') === GEETA_ADMIN_ID) throw new Error('This desk receives client notes')
  const saved = await insertRow({
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
  const welcome = await maybeAutoWelcome(saved, payload.visitorId, name).catch(() => null)
  return { ...saved, lastReply: welcome || null }
}

export const replyOnThread = async ({ parentId, visitorId, name, avatar, body, refId = '' }) => {
  const note = String(body || '').trim()
  if (note.length < 1) throw new Error('Write a reply')
  const who = String(name || '').trim()
  if (who.length < 2) throw new Error('Join the parlor first')

  const row = {
    id: makeId(),
    from_visitor_id: visitorId || 'anon',
    from_name: who.slice(0, 24),
    from_avatar: avatar || 'lotus',
    kind: 'reply',
    ref_id: refId,
    body: note.slice(0, 280),
    parent_id: parentId,
  }
  const saved = await insertRow(row)
  const cached = threadCache.get(parentId) || []
  if (!cached.some((item) => item.id === saved.id)) {
    rememberThread(parentId, [...cached, saved])
  }
  return saved
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
      const rows = normalize(data).sort((a, b) => String(a.created_at || '').localeCompare(String(b.created_at || '')))
      return rememberThread(root.id, rows.length ? rows : [root])
    }
    if (!schemaError(error)) return rememberThread(root.id, [root])
  }
  return rememberThread(root.id, [root])
}

export const sendChatToGeeta = async ({ visitorId, name, avatar, body }) => {
  const note = String(body || '').trim()
  if (!note) throw new Error('Write a message')
  const who = String(name || '').trim()
  if (who.length < 2) throw new Error('Join the parlor first')
  if (!visitorId || visitorId === 'anon') throw new Error('Join the parlor first')
  if (visitorId === GEETA_ADMIN_ID) throw new Error('This desk receives client notes')

  const existing = (await loadMyThreads(visitorId, { fresh: true })).find(isChatThread)
  if (existing) {
    if (isLiveChatThread(existing)) {
      const reply = await replyOnThread({
        parentId: existing.id,
        visitorId,
        name: who,
        avatar,
        body: note,
        refId: existing.ref_id,
      })
      const welcome = await maybeAutoWelcome(existing, visitorId, who).catch(() => null)
      return { ...existing, lastReply: welcome || reply }
    }
    const { error } = await supabase.from('parlor_messages').update({ body: note }).eq('id', existing.id)
    if (error) {
      await replyOnThread({
        parentId: existing.id,
        visitorId,
        name: who,
        avatar,
        body: note,
        refId: existing.ref_id,
      })
    } else {
      bustList()
      await revealThread(existing.id)
    }
    const next = { ...existing, body: note }
    const welcome = await maybeAutoWelcome(next, visitorId, who).catch(() => null)
    rememberThread(existing.id, welcome ? [next, welcome] : [next])
    return { ...next, lastReply: welcome || null }
  }

  const row = {
    id: makeId(),
    from_visitor_id: visitorId,
    from_name: who.slice(0, 24),
    from_avatar: avatar || 'lotus',
    kind: 'chat',
    ref_id: '',
    body: note.slice(0, 280),
    parent_id: null,
    status: '',
  }
  let saved
  try {
    saved = await insertRow(row)
  } catch {
    saved = await insertRow({ ...row, kind: 'look', ref_id: '__chat__' })
  }
  const welcome = await maybeAutoWelcome(saved, visitorId, who).catch(() => null)
  rememberThread(saved.id, welcome ? [saved, welcome] : [saved])
  return { ...saved, lastReply: welcome || null }
}

export const subscribeMessages = (onChange) => {
  const channel = supabase
    .channel(`parlor-messages-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'parlor_messages' }, (payload) => {
      const row = payload.new || payload.old || {}
      bustList()
      forgetThread(row.parent_id || row.id)
      onChange?.(payload)
    })
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}

export const deleteThread = async (root, visitorId) => {
  if (!root?.id) throw new Error('Missing chat')
  if (!visitorId) throw new Error('Join the parlor first')
  const local = readLocalHidden(visitorId)
  local.add(root.id)
  writeLocalHidden(visitorId, local)
  forgetThread(root.id)
  bustList()
  const { error } = await supabase.from('parlor_hidden_chats').upsert(
    { thread_id: root.id, visitor_id: visitorId },
    { onConflict: 'thread_id,visitor_id' }
  )
  if (error && !missingHideTable(error)) {
    throw new Error(error.message || 'Could not delete chat')
  }
}

export const loadGeetaInbox = async ({ fresh = false } = {}) => {
  const [rows, hidden] = await Promise.all([fetchMessages(fresh), loadHiddenThreadIds(GEETA_ADMIN_ID)])
  const roots = rows.filter((row) => isRoot(row) && !hidden.has(row.id))
  const replies = rows.filter((row) => !isRoot(row))
  return withLastReply(roots, replies)
}

export const loadMyThreads = async (visitorId, { fresh = false } = {}) => {
  if (!visitorId || visitorId === 'anon') return []
  const [rows, hidden] = await Promise.all([fetchMessages(fresh), loadHiddenThreadIds(visitorId)])
  const mine = new Set(rows.filter((row) => row.from_visitor_id === visitorId && isRoot(row)).map((row) => row.id))
  const roots = rows.filter((row) => mine.has(row.id) && !hidden.has(row.id))
  const replies = rows.filter((row) => mine.has(row.parent_id))
  return withLastReply(roots, replies)
}
