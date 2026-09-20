import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const GoatCounter = () => {
  const { pathname, search } = useLocation()

  useEffect(() => {
    const path = `${pathname}${search}` || '/'
    const send = () => {
      if (!window.goatcounter?.count) return false
      window.goatcounter.count({ path, title: document.title })
      return true
    }

    if (send()) return undefined

    const timer = window.setInterval(() => {
      if (send()) window.clearInterval(timer)
    }, 100)
    const timeout = window.setTimeout(() => window.clearInterval(timer), 6000)

    return () => {
      window.clearInterval(timer)
      window.clearTimeout(timeout)
    }
  }, [pathname, search])

  return null
}

export default GoatCounter
