import { serviceImages } from '../../utils/imageImports'
import { about, brand } from '../../data/content'
import { useBooking } from '../../context/BookingContext'

const About = () => {
  const { openBooking } = useBooking()

  return (
  <section id="about" className="scroll-target bg-cream">
    <div className="mx-auto grid w-[min(92%,1200px)] items-center gap-12 py-20 lg:grid-cols-2 lg:gap-20 lg:py-28">
      <div>
        <p className="section-badge">{about.badge}</p>
        <h2 className="mt-5 font-display text-4xl font-semibold leading-tight text-ivory lg:text-5xl">
          {about.heading}
        </h2>
        {about.body.map((paragraph) => (
          <p key={paragraph} className="mt-5 text-lg leading-relaxed text-ivory/75">
            {paragraph}
          </p>
        ))}

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {about.highlights.map((item) => (
            <div key={item.title} className="rounded-2xl border border-white/10 bg-panel p-6">
              <h3 className="font-display text-xl text-ivory">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ivory/65">{item.text}</p>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => openBooking('a consultation')}
          className="btn-primary mt-8"
        >
          Book a consultation
        </button>
      </div>

      <div className="relative">
        <img
          src={serviceImages.makeup.artist}
          alt={`${brand.owner}, beauty artist at ${brand.name}`}
          className="h-[520px] w-full rounded-3xl object-cover shadow-card lg:h-[640px]"
        />
        <div className="absolute -bottom-5 left-6 rounded-2xl border border-white/10 bg-panel px-5 py-4">
          <p className="font-display text-lg text-ivory">{brand.owner}</p>
          <p className="text-sm text-brand-300">{brand.location}</p>
        </div>
      </div>
    </div>
  </section>
  )
}

export default About
