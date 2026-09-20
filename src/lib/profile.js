import { supabase } from './supabase'
import { setVisitorId } from './visitor'

const KEY = 'gbp-parlor-profile'
const PIN_KEY = 'gbp-parlor-pin-set'

export const PARLOR_AVATARS = [
  { id: 'lotus', emoji: '🪷', bg: '#6b2d3c' },
  { id: 'rose', emoji: '🌹', bg: '#7a3a2e' },
  { id: 'spark', emoji: '✨', bg: '#4a3728' },
  { id: 'moon', emoji: '🌙', bg: '#2c3348' },
  { id: 'sun', emoji: '☀️', bg: '#6a4a28' },
  { id: 'bloom', emoji: '🌸', bg: '#6b3a52' },
  { id: 'pearl', emoji: '🤍', bg: '#5a3d48' },
  { id: 'leaf', emoji: '🌿', bg: '#2f4a3c' },
]

export const PARLOR_ROLES = [
  { id: 'client', label: 'Client', hint: "I've had a look at the parlor" },
  { id: 'customer', label: 'Customer', hint: "I'm here to look and book" },
]

const ALLOWED_ROLES = [...PARLOR_ROLES.map((item) => item.id), 'admin']

export const GEETA_ADMIN_ID = 'geeta-admin'

export const isAdminProfile = (profile, visitorId) =>
  profile?.role === 'admin' && visitorId === GEETA_ADMIN_ID

export const isGeetaName = (value) => String(value || '').trim().toLowerCase() === 'geeta'

export const parlorAvatar = (id) => PARLOR_AVATARS.find((item) => item.id === id) || PARLOR_AVATARS[0]

const cleanName = (value) => value.trim().replace(/\s+/g, ' ')

export const isProfileName = (value) => {
  const name = cleanName(value)
  return name.length >= 2 && name.length <= 24 && /^[\p{L}\p{M} .'-]+$/u.test(name)
}

export const isParlorPin = (value) => /^\d{4}$/.test(String(value || ''))

export const hasParlorPin = () => {
  try {
    return window.localStorage.getItem(PIN_KEY) === '1'
  } catch {
    return false
  }
}

const markParlorPin = () => {
  window.localStorage.setItem(PIN_KEY, '1')
}

export const readLocalProfile = () => {
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return null
    const next = JSON.parse(raw)
    if (!next?.name || !next?.avatar || !ALLOWED_ROLES.includes(next.role)) return null
    return { name: next.name, avatar: next.avatar, role: next.role }
  } catch {
    return null
  }
}

export const writeLocalProfile = (profile) => {
  window.localStorage.setItem(KEY, JSON.stringify(profile))
}

export const clearLocalProfile = () => {
  window.localStorage.removeItem(KEY)
  window.localStorage.removeItem(PIN_KEY)
}

const rpcError = (error, fallback) => {
  const message = error?.message || fallback
  if (/PIN must be 4 digits/i.test(message)) return 'PIN must be 4 digits'
  if (/does not match/i.test(message)) return 'Name or PIN does not match'
  if (/Join the parlor first/i.test(message)) return 'Save your parlor self first, then add a PIN'
  return message
}

export const saveParlorPin = async (visitorId, pin) => {
  if (!isParlorPin(pin)) throw new Error('PIN must be 4 digits')
  const { error } = await supabase.rpc('parlor_set_pin', {
    p_visitor_id: visitorId,
    p_pin: pin,
  })
  if (error) throw new Error(rpcError(error, 'Could not save PIN'))
  markParlorPin()
}

export const saveParlorProfile = async (visitorId, draft) => {
  const name = cleanName(draft.name)
  if (!isProfileName(name)) throw new Error('Enter a short name')
  if (isGeetaName(name) && visitorId !== GEETA_ADMIN_ID) {
    throw new Error('Geeta is the studio login. Use I have a PIN.')
  }
  if (!PARLOR_AVATARS.some((item) => item.id === draft.avatar)) throw new Error('Pick an avatar')
  if (draft.role === 'admin' || visitorId === GEETA_ADMIN_ID) {
    const profile = { name: 'Geeta', avatar: draft.avatar || 'bloom', role: 'admin' }
    writeLocalProfile(profile)
    if (draft.pin) await saveParlorPin(GEETA_ADMIN_ID, draft.pin)
    return profile
  }
  if (!PARLOR_ROLES.some((role) => role.id === draft.role)) throw new Error('Pick client or customer')

  const profile = { name, avatar: draft.avatar, role: draft.role }
  writeLocalProfile(profile)

  const { error } = await supabase.from('parlor_profiles').upsert(
    {
      visitor_id: visitorId,
      name: profile.name,
      avatar: profile.avatar,
      role: profile.role,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'visitor_id' }
  )
  if (error) throw new Error(error.message)

  if (draft.pin) await saveParlorPin(visitorId, draft.pin)
  return profile
}

export const loginParlorProfile = async (name, pin) => {
  if (!isProfileName(name)) throw new Error('Enter your parlor name')
  if (!isParlorPin(pin)) throw new Error('PIN must be 4 digits')

  const { data, error } = await supabase.rpc('parlor_login', {
    p_name: cleanName(name),
    p_pin: pin,
  })
  if (error) throw new Error(rpcError(error, 'Name or PIN does not match'))

  const row = data || {}
  if (!row.visitor_id || !row.name) throw new Error('Name or PIN does not match')

  setVisitorId(row.visitor_id)
  const profile = { name: row.name, avatar: row.avatar, role: row.role }
  writeLocalProfile(profile)
  markParlorPin()
  return { visitorId: row.visitor_id, profile }
}
