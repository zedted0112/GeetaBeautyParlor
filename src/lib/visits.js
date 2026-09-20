import { supabase } from './supabase'
import { sendToGeeta } from './messages'

const KEY = 'gbp-parlor-visits'

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

const readAll = () => {
  try {
    const raw = window.localStorage.getItem(KEY)
    const next = raw ? JSON.parse(raw) : {}
    return next && typeof next === 'object' ? next : {}
  } catch {
    return {}
  }
}

const writeAll = (all) => {
  window.localStorage.setItem(KEY, JSON.stringify(all))
}

const putLocal = (visitorId, rows) => {
  const all = readAll()
  all[visitorId] = rows
  writeAll(all)
}

export const readLocalVisits = (visitorId) => {
  if (!visitorId) return []
  const rows = readAll()[visitorId]
  return Array.isArray(rows) ? rows : []
}

const fromRow = (row) => ({
  id: row.id,
  name: row.name || '',
  service: row.service,
  date: row.visit_on || row.date,
  message: row.note || row.message || '',
  createdAt: row.created_at || row.createdAt,
})

const remotePayload = (visitorId, row) => ({
  id: row.id,
  visitor_id: visitorId,
  service: String(row.service || 'a visit').slice(0, 80),
  visit_on: row.date,
  note: row.message || '',
})

const insertRemote = async (visitorId, row) => {
  const { error } = await supabase.from('parlor_visits').insert(remotePayload(visitorId, row))
  if (!error) return
  if (/duplicate|already exists|unique/i.test(error.message || '')) return
  throw new Error(error.message || 'Could not save plan')
}

export const loadVisits = async (visitorId) => {
  const local = readLocalVisits(visitorId)
  if (!visitorId || visitorId === 'anon') return local

  const { data, error } = await supabase
    .from('parlor_visits')
    .select('id, service, visit_on, note, created_at')
    .eq('visitor_id', visitorId)
    .order('visit_on', { ascending: true })

  if (error) return local

  const remote = (data || []).map(fromRow)
  const remoteIds = new Set(remote.map((row) => row.id))
  const unsynced = local.filter((row) => row.id && !remoteIds.has(row.id))

  await Promise.all(
    unsynced.map((row) =>
      insertRemote(visitorId, row).catch(() => {
        // keep it local and try again next open
      })
    )
  )

  const byId = Object.fromEntries([...remote, ...unsynced, ...local].map((row) => [row.id, row]))
  const merged = Object.values(byId).sort((a, b) => String(a.date).localeCompare(String(b.date)))
  putLocal(visitorId, merged)
  return merged
}

export const prettyVisitDate = (value) => {
  if (!value) return ''
  return new Date(`${value}T00:00:00`).toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export const prettyVisitTime = (value) => {
  const time = String(value || '').trim()
  if (!/^\d{2}:\d{2}/.test(time)) return ''
  const [hour, minute] = time.split(':').map(Number)
  const date = new Date()
  date.setHours(hour, minute, 0, 0)
  return date.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })
}

export const prettyVisitWhen = (date, time) => {
  const day = prettyVisitDate(date)
  const clock = prettyVisitTime(time)
  if (day && clock) return `${day} · ${clock}`
  return day || clock
}

export const addVisit = async (visitorId, draft) => {
  if (!visitorId || visitorId === 'anon') throw new Error('Join the parlor first')
  if (!draft?.date) throw new Error('Pick a date')

  const row = {
    id: makeId(),
    name: draft.name || '',
    service: draft.service || 'a visit',
    date: draft.date,
    time: draft.time || '',
    message: draft.message || '',
    createdAt: new Date().toISOString(),
  }
  putLocal(visitorId, [row, ...readLocalVisits(visitorId)])
  await insertRemote(visitorId, row)
  return row
}

export const adoptVisits = async (fromId, toId) => {
  if (!fromId || !toId || fromId === toId) return
  const moving = readLocalVisits(fromId)
  if (!moving.length) return

  const next = [
    ...moving.map((row) => ({ ...row, id: makeId() })),
    ...readLocalVisits(toId),
  ]
  putLocal(toId, next)
  const all = readAll()
  delete all[fromId]
  writeAll(all)

  await Promise.all(next.map((row) => insertRemote(toId, row).catch(() => {})))
}

export const sendVisitToGeeta = async (visit, profile, visitorId) => {
  await sendToGeeta({
    visitorId,
    name: visit.name || profile?.name,
    avatar: profile?.avatar,
    kind: 'book',
    date: visit.date,
    time: visit.time || '',
    service: visit.service || 'an appointment',
    body: visit.message || '',
  })
}
