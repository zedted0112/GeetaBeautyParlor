import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const BookingContext = createContext(null)

export const BookingProvider = ({ children }) => {
  const [open, setOpen] = useState(false)
  const [service, setService] = useState('Consultation')
  const [intent, setIntent] = useState('book')

  const openBooking = useCallback((nextService = 'Consultation') => {
    setIntent('book')
    setService(nextService)
    setOpen(true)
  }, [])

  const openPlan = useCallback((nextService = 'a visit') => {
    setIntent('plan')
    setService(nextService)
    setOpen(true)
  }, [])

  const closeBooking = useCallback(() => setOpen(false), [])

  const value = useMemo(
    () => ({ open, service, intent, openBooking, openPlan, closeBooking }),
    [open, service, intent, openBooking, openPlan, closeBooking]
  )

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
}

export const useBooking = () => {
  const context = useContext(BookingContext)
  if (!context) {
    throw new Error('useBooking must be used within BookingProvider')
  }
  return context
}
