import { useState } from 'react'
import { serviceImages } from '../../utils/imageImports'
import { services } from '../../data/content'
import BridalGallery from './BridalGallery'
import ServiceDeck from './ServiceDeck'
import { useBooking } from '../../context/BookingContext'

const images = {
  bridal: serviceImages.bridal.studio1,
  makeup: serviceImages.makeup.main,
  hair: serviceImages.hair.main,
  facial: serviceImages.facial.main,
  spa: serviceImages.spa.main,
  waxing: serviceImages.waxing.main,
}

const orderedServices = [
  ...services.filter((service) => service.id === 'bridal'),
  ...services.filter((service) => service.id !== 'bridal'),
]

const Services = () => {
  const [bridalOpen, setBridalOpen] = useState(false)
  const { openBooking } = useBooking()

  const renderCard = (service, options = {}) => {
    const isBridal = service.id === 'bridal'
    const glass = Boolean(options.glass)

    return (
      <article
        key={service.id}
        className={
          glass
            ? 'service-glass group flex h-full w-full flex-col overflow-hidden rounded-2xl'
            : 'group flex h-full w-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-panel'
        }
      >
        <div className="service-photo relative">
          <img
            src={images[service.image]}
            alt={service.name}
            className="transition duration-700 group-hover:scale-105"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
        </div>
        <div className={glass ? 'service-glass-copy px-3 py-2.5' : 'px-4 py-3'}>
          <h3 className="font-display text-base text-ivory sm:text-lg">{service.name}</h3>
          <p className="mt-0.5 text-[11px] leading-snug text-ivory/60 sm:mt-1 sm:text-xs">{service.blurb}</p>
          {isBridal ? (
            <button
              type="button"
              onClick={() => setBridalOpen(true)}
              className="mt-1.5 inline-flex text-[11px] font-semibold text-brand-300 transition hover:text-brand-200 sm:mt-2.5 sm:text-xs"
            >
              <span className="sm:hidden">Gallery →</span>
              <span className="hidden sm:inline">View bride shoots →</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => openBooking(service.name)}
              className="mt-1.5 inline-flex text-[11px] font-semibold text-brand-300 transition hover:text-brand-200 sm:mt-2.5 sm:text-xs"
            >
              Book this →
            </button>
          )}
        </div>
      </article>
    )
  }

  return (
    <section id="services" className="scroll-target bg-sand">
      <div className="mx-auto w-[min(92%,1360px)] py-9 sm:py-14 lg:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-badge">What we do</p>
          <h2 className="mt-3 font-display text-2xl font-semibold text-ivory sm:mt-5 sm:text-4xl lg:text-5xl">
            Services, not a catalogue
          </h2>
          <p className="mt-2 text-sm text-ivory/70 sm:mt-4 sm:text-lg">
            Choose what you need. We will build the look around your day, your jewellery, and your light.
          </p>
        </div>

        <div className="mt-6">
          <ServiceDeck items={orderedServices} renderCard={renderCard} />
        </div>

        <div className="mt-14 hidden items-stretch gap-5 sm:grid sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {orderedServices.map((service) => renderCard(service))}
        </div>
      </div>

      <BridalGallery open={bridalOpen} onClose={() => setBridalOpen(false)} />
    </section>
  )
}

export default Services
