const KEY = 'geeta-visitor-id'

export const getVisitorId = () => {
  try {
    let id = window.localStorage.getItem(KEY)
    if (!id) {
      id = window.crypto.randomUUID()
      window.localStorage.setItem(KEY, id)
    }
    return id
  } catch {
    return 'anon'
  }
}

export const setVisitorId = (id) => {
  if (!id) return
  window.localStorage.setItem(KEY, id)
}
