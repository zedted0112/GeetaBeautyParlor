const held = new Map()

export const holdImage = (src) => {
  if (!src || held.has(src)) return
  const img = new Image()
  img.decoding = 'async'
  img.src = src
  held.set(src, img)
}

export const holdImages = (srcs) => {
  ;(srcs || []).forEach(holdImage)
}
