import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { getVisitorId } from '../lib/visitor'
import {
  clearLocalProfile,
  isAdminProfile,
  loginParlorProfile,
  readLocalProfile,
  saveParlorProfile,
} from '../lib/profile'
import { adoptVisits } from '../lib/visits'
import { seedGeetaAdmin } from '../lib/messages'

const ParlorContext = createContext(null)

export const ParlorProvider = ({ children }) => {
  const [visitorId, setVisitorIdState] = useState(() => getVisitorId())
  const [profile, setProfile] = useState(() => readLocalProfile())
  const [signupOpen, setSignupOpen] = useState(false)
  const [startMode, setStartMode] = useState('join')
  const [goToSpace, setGoToSpace] = useState(false)
  const pending = useRef(null)

  useEffect(() => {
    seedGeetaAdmin().catch(() => {})
  }, [])

  useEffect(() => {
    const local = readLocalProfile()
    if (!local || isAdminProfile(local, visitorId)) return undefined
    saveParlorProfile(visitorId, local).catch(() => {})
    return undefined
  }, [visitorId])

  const resolvePending = (ok) => {
    pending.current?.(ok)
    pending.current = null
  }

  const ensureProfile = useCallback(
    () =>
      new Promise((resolve) => {
        if (readLocalProfile()) {
          resolve(true)
          return
        }
        pending.current = resolve
        setGoToSpace(false)
        setStartMode('join')
        setSignupOpen(true)
      }),
    []
  )

  const openProfile = useCallback(() => {
    setGoToSpace(false)
    setStartMode(readLocalProfile() ? 'edit' : 'join')
    setSignupOpen(true)
  }, [])

  const openLogin = useCallback(() => {
    setGoToSpace(true)
    setStartMode(readLocalProfile() ? 'edit' : 'return')
    setSignupOpen(true)
  }, [])

  const closeSignup = useCallback(() => {
    setSignupOpen(false)
    resolvePending(false)
  }, [])

  const submitProfile = useCallback(
    async (draft) => {
      const next = await saveParlorProfile(visitorId, draft)
      setProfile(next)
      setSignupOpen(false)
      resolvePending(true)
      return next
    },
    [visitorId]
  )

  const loginProfile = useCallback(async (name, pin) => {
    const previousId = getVisitorId()
    const next = await loginParlorProfile(name, pin)
    if (!isAdminProfile(next.profile, next.visitorId)) await adoptVisits(previousId, next.visitorId)
    setVisitorIdState(next.visitorId)
    setProfile(next.profile)
    setSignupOpen(false)
    resolvePending(true)
    return next.profile
  }, [])

  const switchProfile = useCallback(() => {
    clearLocalProfile()
    setProfile(null)
    setGoToSpace(true)
    setStartMode('return')
  }, [])

  const value = useMemo(
    () => ({
      visitorId,
      profile,
      signupOpen,
      startMode,
      goToSpace,
      ensureProfile,
      openProfile,
      openLogin,
      closeSignup,
      submitProfile,
      loginProfile,
      switchProfile,
    }),
    [
      visitorId,
      profile,
      signupOpen,
      startMode,
      goToSpace,
      ensureProfile,
      openProfile,
      openLogin,
      closeSignup,
      submitProfile,
      loginProfile,
      switchProfile,
    ]
  )

  return <ParlorContext.Provider value={value}>{children}</ParlorContext.Provider>
}

export const useParlor = () => {
  const context = useContext(ParlorContext)
  if (!context) {
    throw new Error('useParlor must be used within ParlorProvider')
  }
  return context
}
