import { useEffect, useState } from 'react'
import { IoIosCloseCircle } from 'react-icons/io'
import { serviceImages } from '../../utils/imageImports'
import { whatsappUrl } from '../../data/content'

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

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/85 p-3 backdrop-blur-sm sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="bridal-gallery-title"
    >
      <div
        className="relative flex h-[min(94vh,920px)] w-[min(96vw,1280px)] flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#14110f] shadow-2xl lg:flex-row"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative flex min-h-0 flex-1 items-center justify-center bg-black">
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
        </div>

        <aside className="flex w-full shrink-0 flex-col border-t border-white/10 p-5 lg:w-[360px] lg:border-l lg:border-t-0 lg:p-6">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <p className="section-badge">Bride shoots</p>
              <h3 id="bridal-gallery-title" className="mt-3 font-display text-3xl text-ivory">
                Bridal looks
              </h3>
              <p className="mt-2 text-sm text-ivory/65">
                Every shoot sits in the same frame, so the full look always fits.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-1 text-ivory/70 transition hover:text-ivory"
              aria-label="Close gallery"
            >
              <IoIosCloseCircle className="h-9 w-9" />
            </button>
          </div>

          <div className="grid min-h-0 flex-1 grid-cols-4 gap-2 overflow-y-auto sm:grid-cols-5 lg:grid-cols-3">
            {bridalPhotos.map((src, index) => (
              <button
                key={src}
                type="button"
                onClick={() => setActive(index)}
                className={`photo-thumb ${index === active ? 'border-brand-400' : 'border-transparent'}`}
                aria-label={`Show bridal photo ${index + 1}`}
              >
                <img src={src} alt="" className="h-full w-full object-cover object-[center_20%]" />
              </button>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between gap-3">
            <p className="text-sm text-ivory/50">
              {active + 1} / {bridalPhotos.length}
            </p>
            <a
              href={whatsappUrl('Hi Geeta, I want to book Bridal Makeup after seeing the bride shoots.')}
              target="_blank"
              rel="noreferrer"
              className="btn-primary px-5 py-3"
            >
              Book bridal makeup
            </a>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default BridalGallery
