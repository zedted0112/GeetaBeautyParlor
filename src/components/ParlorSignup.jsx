import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IoIosCloseCircle } from 'react-icons/io'
import { useParlor } from '../context/ParlorContext'
import { PARLOR_AVATARS, PARLOR_ROLES, hasParlorPin, isParlorPin, isProfileName } from '../lib/profile'
import ParlorAvatar from './ParlorAvatar'

const ParlorSignup = () => {
  const { profile, signupOpen, startMode, goToSpace, closeSignup, submitProfile, loginProfile, switchProfile } = useParlor()
  const navigate = useNavigate()
  const [mode, setMode] = useState('join')
  const [name, setName] = useState('')
  const [avatar, setAvatar] = useState(PARLOR_AVATARS[0].id)
  const [role, setRole] = useState('')
  const [pin, setPin] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!signupOpen) return undefined
    const editing = Boolean(profile)
    setMode(editing ? 'edit' : startMode === 'return' ? 'return' : 'join')
    setName(profile?.name || '')
    setAvatar(profile?.avatar || PARLOR_AVATARS[0].id)
    setRole(profile?.role || '')
    setPin('')
    setError('')
    setBusy(false)

    const onKey = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        closeSignup()
      }
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [signupOpen, profile, startMode, closeSignup])

  if (!signupOpen) return null

  const editing = Boolean(profile)
  const returning = mode === 'return'
  const pinNeeded = returning || !editing || !hasParlorPin()
  const canJoin = isProfileName(name) && avatar && role && (!pinNeeded || isParlorPin(pin)) && !busy
  const canReturn = isProfileName(name) && isParlorPin(pin) && !busy
  const canSave = returning ? canReturn : canJoin

  const onSubmit = async (event) => {
    event.preventDefault()
    if (!canSave) return
    setBusy(true)
    setError('')
    try {
      if (returning) await loginProfile(name, pin)
      else await submitProfile({ name, avatar, role, pin: pin || undefined })
      if (goToSpace) navigate('/me')
    } catch (err) {
      setError(err.message || 'Could not save. Try again.')
      setBusy(false)
    }
  }

  const title = returning ? 'Welcome back' : editing ? 'Your parlor self' : 'Join the parlor'
  const copy = returning
    ? 'Name + PIN brings your likes back.'
    : editing
      ? hasParlorPin()
        ? 'Leave PIN blank to keep yours.'
        : 'Add a 4-digit PIN to keep this self.'
      : 'Name, face, and PIN — that’s your self.'

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-md"
      onClick={closeSignup}
      role="dialog"
      aria-modal="true"
      aria-labelledby="parlor-signup-title"
    >
      <div
        className="max-h-[80dvh] w-full max-w-[22rem] overflow-y-auto rounded-2xl border border-white/25 bg-white/10 p-3.5 shadow-[0_24px_80px_rgba(0,0,0,0.45)] ring-1 ring-white/10 backdrop-blur-2xl sm:p-4"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-3 flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[9px] uppercase tracking-[0.16em] text-brand-200">Parlor profile</p>
            <h2 id="parlor-signup-title" className="mt-0.5 font-display text-xl leading-tight text-ivory">
              {title}
            </h2>
            <p className="mt-0.5 text-[11px] leading-snug text-ivory/60">{copy}</p>
          </div>
          <button
            type="button"
            onClick={closeSignup}
            className="-mr-1 -mt-0.5 rounded-full p-0.5 text-ivory/70 transition hover:text-ivory"
            aria-label="Close parlor signup"
          >
            <IoIosCloseCircle className="h-7 w-7" />
          </button>
        </div>

        {!editing ? (
          <div className="mb-3 grid grid-cols-2 gap-1 rounded-full bg-black/25 p-0.5">
            <button
              type="button"
              className={`rounded-full px-2.5 py-1.5 text-[11px] font-semibold ${returning ? 'text-ivory/55' : 'bg-white/15 text-ivory'}`}
              onClick={() => {
                setMode('join')
                setError('')
              }}
            >
              New
            </button>
            <button
              type="button"
              className={`rounded-full px-2.5 py-1.5 text-[11px] font-semibold ${returning ? 'bg-white/15 text-ivory' : 'text-ivory/55'}`}
              onClick={() => {
                setMode('return')
                setError('')
              }}
            >
              I have a PIN
            </button>
          </div>
        ) : null}

        <form className="space-y-3" onSubmit={onSubmit}>
          <label className="block">
            <span className="mb-1 block text-[10px] uppercase tracking-[0.14em] text-ivory/55">Name</span>
            <input
              required
              autoFocus
              name="parlor-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="username"
              placeholder="Your name"
              maxLength={24}
              className="booking-input parlor-input"
            />
          </label>

          {!returning ? (
            <>
              <fieldset>
                <legend className="mb-1 block text-[10px] uppercase tracking-[0.14em] text-ivory/55">Avatar</legend>
                <div className="grid grid-cols-8 gap-1">
                  {PARLOR_AVATARS.map((item) => {
                    const on = avatar === item.id
                    return (
                      <button
                        key={item.id}
                        type="button"
                        className={`parlor-avatar-pick ${on ? 'is-on' : ''}`}
                        aria-label={item.id}
                        aria-pressed={on}
                        onClick={() => setAvatar(item.id)}
                      >
                        <ParlorAvatar id={item.id} size="sm" />
                      </button>
                    )
                  })}
                </div>
              </fieldset>

              <fieldset>
                <legend className="mb-1 block text-[10px] uppercase tracking-[0.14em] text-ivory/55">I am a</legend>
                <div className="grid grid-cols-2 gap-1.5">
                  {PARLOR_ROLES.map((item) => {
                    const on = role === item.id
                    return (
                      <button
                        key={item.id}
                        type="button"
                        className={`parlor-role ${on ? 'is-on' : ''}`}
                        aria-pressed={on}
                        onClick={() => setRole(item.id)}
                      >
                        <span className="block text-[13px] font-semibold text-ivory">{item.label}</span>
                        <span className="mt-0.5 block text-[10px] leading-snug text-ivory/50">{item.hint}</span>
                      </button>
                    )
                  })}
                </div>
              </fieldset>
            </>
          ) : null}

          <label className="block">
            <span className="mb-1 block text-[10px] uppercase tracking-[0.14em] text-ivory/55">
              {editing && hasParlorPin() ? 'New PIN (optional)' : '4-digit PIN'}
            </span>
            <input
              required={pinNeeded}
              name="parlor-pin"
              value={pin}
              onChange={(event) => setPin(event.target.value.replace(/\D/g, '').slice(0, 4))}
              inputMode="numeric"
              autoComplete={returning ? 'current-password' : 'new-password'}
              placeholder="••••"
              maxLength={4}
              className="booking-input parlor-input tracking-[0.35em]"
            />
          </label>

          {error ? <p className="text-xs text-rose-200">{error}</p> : null}

          <button type="submit" className="btn-primary w-full !min-h-10 !py-2 !text-xs" disabled={!canSave}>
            {returning ? 'Come back in' : editing ? 'Save' : 'Join and react'}
          </button>
        </form>

        {editing ? (
          <button
            type="button"
            className="mt-2 w-full text-center text-[11px] text-ivory/45 underline-offset-2 hover:text-ivory/70 hover:underline"
            onClick={() => {
              switchProfile()
              setMode('return')
              setName('')
              setPin('')
              setRole('')
              setError('')
            }}
          >
            Use another parlor self
          </button>
        ) : null}
      </div>
    </div>
  )
}

export default ParlorSignup
