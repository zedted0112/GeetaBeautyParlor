import { serviceImages } from '../../utils/imageImports'
import { services, whatsappUrl } from '../../data/content'

const images = {
  bridal: serviceImages.bridal.portrait2,
  makeup: serviceImages.makeup.main,
  hair: serviceImages.hair.main,
  facial: serviceImages.facial.main,
  spa: serviceImages.spa.main,
  waxing: serviceImages.waxing.main,
}

const Services = () => (
  <section id="services" className="scroll-target bg-sand">
    <div className="mx-auto w-[min(92%,1200px)] py-20 lg:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <p className="section-badge">What we do</p>
        <h2 className="mt-5 font-display text-4xl font-semibold text-ivory lg:text-5xl">
          Services, not a catalogue
        </h2>
        <p className="mt-4 text-lg text-ivory/70">
          Choose what you need. We will build the look around your day, your jewellery, and your light.
        </p>
      </div>

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <article
            key={service.id}
            className="group overflow-hidden rounded-3xl border border-white/10 bg-panel"
          >
            <div className="relative h-64 overflow-hidden">
              <img
                src={images[service.image]}
                alt={service.name}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
            <div className="p-6">
              <h3 className="font-display text-2xl text-ivory">{service.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ivory/65">{service.blurb}</p>
              <a
                href={whatsappUrl(`Hi Geeta, I want to book ${service.name} at Geeta Makeovers.`)}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex text-sm font-semibold text-brand-300 transition hover:text-brand-200"
              >
                Book this →
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
)

export default Services
