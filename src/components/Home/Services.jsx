import { useState } from 'react'
import { serviceImages } from '../../utils/imageImports'
import { services, whatsappUrl } from '../../data/content'
import BridalGallery from './BridalGallery'

const images = {
  bridal: serviceImages.bridal.studio1,
  makeup: serviceImages.makeup.main,
  hair: serviceImages.hair.main,
  facial: serviceImages.facial.main,
  spa: serviceImages.spa.main,
  waxing: serviceImages.waxing.main,
}

const Services = () => {
  const [bridalOpen, setBridalOpen] = useState(false)

  return (
    <section id="services" className="scroll-target bg-sand">
      <div className="mx-auto w-[min(96%,1360px)] py-20 lg:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-badge">What we do</p>
          <h2 className="mt-5 font-display text-4xl font-semibold text-ivory lg:text-5xl">
            Services, not a catalogue
          </h2>
          <p className="mt-4 text-lg text-ivory/70">
            Choose what you need. We will build the look around your day, your jewellery, and your light.
          </p>
        </div>

        <div className="mt-14 grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {services.map((service) => {
            const isBridal = service.id === 'bridal'

            return (
              <article
                key={service.id}
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-panel"
              >
                <div className="service-photo relative">
                  <img
                    src={images[service.image]}
                    alt={service.name}
                    className="transition duration-700 group-hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                </div>
                <div className="px-4 py-3">
                  <h3 className="font-display text-lg text-ivory">{service.name}</h3>
                  <p className="mt-1 text-xs leading-snug text-ivory/60">{service.blurb}</p>
                  {isBridal ? (
                    <button
                      type="button"
                      onClick={() => setBridalOpen(true)}
                      className="mt-2.5 inline-flex text-xs font-semibold text-brand-300 transition hover:text-brand-200"
                    >
                      View bride shoots →
                    </button>
                  ) : (
                    <a
                      href={whatsappUrl(`Hi Geeta, I want to book ${service.name} at Geeta Makeovers.`)}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2.5 inline-flex text-xs font-semibold text-brand-300 transition hover:text-brand-200"
                    >
                      Book this →
                    </a>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      </div>

      <BridalGallery open={bridalOpen} onClose={() => setBridalOpen(false)} />
    </section>
  )
}

export default Services
