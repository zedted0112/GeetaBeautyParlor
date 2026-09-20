import { useEffect, useRef, useState } from 'react'
import { IoIosCloseCircle } from 'react-icons/io'
import { serviceImages } from '../../utils/imageImports'
import { useBooking } from '../../context/BookingContext'

export const bridalPhotos = [
  serviceImages.bridal.studio7,
  serviceImages.bridal.studio8,
  serviceImages.bridal.studio9,
  serviceImages.bridal.studio10,
  serviceImages.bridal.studio11,
  serviceImages.bridal.studio1,
  serviceImages.bridal.studio2,
  serviceImages.bridal.studio3,
  serviceImages.bridal.studio4,
  serviceImages.bridal.studio5,
  serviceImages.bridal.studio6,
  serviceImages.bridal.portrait2,
  serviceImages.bridal.portrait1,
  serviceImages.bridal.main1,
  serviceImages.bridal.main2,
  serviceImages.bridal.main4,
  serviceImages.bridal.main5,
  serviceImages.bridal.main6,
  serviceImages.bridal.main7,
  serviceImages.bridal.group1,
  serviceImages.bridal.group2,
  serviceImages.bridal.main3,
]

const BridalGallery = ({ open, onClose }) => {
  const [active, setActive] = useState(0)
  const { openBooking } = useBooking()
  const touchX = useRef(null)

  useEffect(() => {
    if (!open) return undefined

    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowRight') {
        setActive((index) => (index + 1) % bridalPhotos.length)
      }
      if (event.key === 'ArrowLeft') {
        setActive((index) => (index - 1 + bridalPhotos.length) % bridalPhotos.length)
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  const goPrev = () => setActive((index) => (index - 1 + bridalPhotos.length) % bridalPhotos.length)
  const goNext = () => setActive((index) => (index + 1) % bridalPhotos.length)

  const onTouchStart = (event) => {
    touchX.current = event.changedTouches[0].clientX
  }

  const onTouchEnd = (event) => {
    if (touchX.current == null) return
    const delta = event.changedTouches[0].clientX - touchX.current
    if (Math.abs(delta) > 40) {
      if (delta < 0) goNext()
      else goPrev()
    }
    touchX.current = null
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-black/85 p-0 backdrop-blur-sm sm:items-center sm:p-3 lg:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="bridal-gallery-title"
    >
      <div
        className="relative flex h-[100dvh] w-full flex-col overflow-hidden border-white/10 bg-[#14110f] shadow-2xl sm:h-[min(94vh,920px)] sm:w-[min(96vw,1280px)] sm:rounded-3xl sm:border lg:flex-row"
        onClick={(event) => event.stopPropagation()}
      >
        <div
          className="relative flex min-h-0 max-h-[58dvh] flex-1 items-center justify-center bg-black pt-[env(safe-area-inset-top)] lg:max-h-none"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div className="photo-frame">
            <img
              src={bridalPhotos[active]}
              alt={`Bridal look ${active + 1}`}
              className="h-full w-full object-contain object-center"
            />
          </div>
          <button
            type="button"
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/55 px-3 py-2 text-white sm:left-5"
            aria-label="Previous photo"
            onClick={goPrev}
          >
            ←
          </button>
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/55 px-3 py-2 text-white sm:right-5"
            aria-label="Next photo"
            onClick={goNext}
          >
            →
          </button>
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-[max(0.75rem,env(safe-area-inset-top))] rounded-full bg-black/55 p-1 text-white lg:hidden"
            aria-label="Close gallery"
          >
            <IoIosCloseCircle className="h-8 w-8" />
          </button>
        </div>

        <aside className="flex w-full shrink-0 flex-col border-t border-white/10 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:p-5 lg:w-[360px] lg:border-l lg:border-t-0 lg:p-6">
          <div className="mb-2 flex items-start justify-between gap-3 sm:mb-3 lg:mb-4">
            <div>
              <div className="hidden sm:block">
                <p className="section-badge">Bride shoots</p>
              </div>
              <h3 id="bridal-gallery-title" className="font-display text-lg text-ivory sm:mt-3 sm:text-3xl">
                Bridal looks
              </h3>
              <p className="mt-2 hidden text-sm text-ivory/65 lg:block">
                Every shoot sits in the same frame, so the full look always fits.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="hidden rounded-full p-1 text-ivory/70 transition hover:text-ivory lg:block"
              aria-label="Close gallery"
            >
              <IoIosCloseCircle className="h-9 w-9" />
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:grid lg:min-h-0 lg:flex-1 lg:grid-cols-3 lg:overflow-y-auto">
            {bridalPhotos.map((src, index) => (
              <button
                key={src}
                type="button"
                onClick={() => setActive(index)}
                className={`photo-thumb h-14 w-11 shrink-0 lg:h-auto lg:w-auto ${index === active ? 'border-brand-400' : 'border-transparent'}`}
                aria-label={`Show bridal photo ${index + 1}`}
              >
                <img src={src} alt="" className="h-full w-full object-cover object-[center_20%]" />
              </button>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between gap-3 sm:mt-5">
            <p className="shrink-0 text-sm text-ivory/50">
              {active + 1} / {bridalPhotos.length}
            </p>
            <button
              type="button"
              className="btn-primary min-h-10 px-4 py-2 text-xs sm:min-h-11 sm:px-5 sm:py-3 sm:text-sm"
              onClick={() => {
                onClose()
                openBooking('Bridal Makeup')
              }}
            >
              Book bridal makeup
            </button>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default BridalGallery
