import { supabase } from './supabase'

export const STUDIO_ZONE = 'Asia/Kolkata'

let offsetMs = 0

export const nowMs = () => Date.now() + offsetMs

export const nowISO = () => new Date(nowMs()).toISOString()

const applyStamp = (value, started, ended) => {
  const server = new Date(value).getTime()
  if (!Number.isFinite(server)) return false
  offsetMs = server + (ended - started) / 2 - ended
  return true
}

const withIstOffset = (value) => {
  const text = String(value || '')
  if (!text) return ''
  if (/[zZ]|[+-]\d{2}:?\d{2}$/.test(text)) return text
  return `${text}+05:30`
}

export const syncClock = async () => {
  const started = Date.now()
  try {
    const { data, error } = await supabase.rpc('parlor_now')
    const ended = Date.now()
    if (!error && data && applyStamp(data, started, ended)) return true
  } catch {
    // studio RPC is optional until the SQL is run
  }

  try {
    const begin = Date.now()
    const res = await fetch('https://timeapi.io/api/Time/current/zone?timeZone=Asia/Kolkata', { cache: 'no-store' })
    const ended = Date.now()
    const json = await res.json()
    if (applyStamp(withIstOffset(json.dateTime || json.utcDateTime), begin, ended)) return true
  } catch {
    // keep the last good offset
  }

  return false
}

export const formatStudioTime = (value) => {
  const time = value ? new Date(value).getTime() : 0
  if (!Number.isFinite(time) || !time) return ''
  return new Date(time).toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: STUDIO_ZONE,
  })
}

export const formatStudioDate = (value) => {
  const time = value ? new Date(value).getTime() : 0
  if (!Number.isFinite(time) || !time) return ''
  return new Date(time).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    timeZone: STUDIO_ZONE,
  })
}

export const studioToday = () => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: STUDIO_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date(nowMs()))
  const pick = (type) => parts.find((part) => part.type === type)?.value
  return `${pick('year')}-${pick('month')}-${pick('day')}`
}
