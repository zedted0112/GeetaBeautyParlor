import { parlorAvatar } from '../lib/profile'

const SIZES = {
  sm: 'h-7 w-7 text-sm',
  md: 'h-11 w-11 text-lg',
  lg: 'h-12 w-12 text-xl',
}

const ParlorAvatar = ({ id, size = 'md', className = '' }) => {
  const avatar = parlorAvatar(id)
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full ${SIZES[size] || SIZES.md} ${className}`}
      style={{ background: avatar.bg }}
      aria-hidden="true"
    >
      {avatar.emoji}
    </span>
  )
}

export default ParlorAvatar
