import { stats } from '../../data/content'
import { useBooking } from '../../context/BookingContext'

const Stats = () => {
  const { openBooking } = useBooking()

  return (
  <section className="bg-ink text-white">
    <div className="mx-auto w-[min(92%,1200px)] py-20 text-center lg:py-24">
      <p className="section-badge-light">Trusted in Uttarkashi</p>
      <h2 className="mt-5 font-display text-4xl font-semibold lg:text-5xl">Work that shows</h2>
      <p className="mx-auto mt-4 max-w-2xl text-lg text-white/70">
        Quiet numbers. Real faces. The same studio, year after year.
      </p>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {stats.map((item) => (
          <div key={item.label} className="rounded-3xl border border-white/10 bg-white/5 px-8 py-10">
            <p className="font-display text-5xl text-brand-300">{item.value}</p>
            <h3 className="mt-3 text-lg font-semibold">{item.label}</h3>
            <p className="mt-2 text-sm text-white/60">{item.detail}</p>
          </div>
        ))}
      </div>

      <button type="button" className="btn-primary mt-12" onClick={() => openBooking('an appointment')}>
        Join our clients
      </button>
    </div>
  </section>
  )
}

export default Stats
