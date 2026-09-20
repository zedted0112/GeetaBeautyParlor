import { stats } from '../../data/content'
import { useBooking } from '../../context/BookingContext'

const Stats = () => {
  const { openBooking } = useBooking()

  return (
    <section className="bg-ink text-white">
      <div className="mx-auto w-[min(92%,1200px)] py-14 text-center lg:py-24">
        <p className="section-badge-light">Trusted in Uttarkashi</p>
        <h2 className="mt-5 font-display text-3xl font-semibold sm:text-4xl lg:text-5xl">Work that shows</h2>
        <p className="mx-auto mt-4 max-w-2xl text-base text-white/70 sm:text-lg">
          Quiet numbers. Real faces. The same studio, year after year.
        </p>

        <div className="mt-10 grid gap-4 sm:mt-12 sm:gap-6 md:grid-cols-3">
          {stats.map((item) => (
            <div key={item.label} className="rounded-3xl border border-white/10 bg-white/5 px-6 py-8 sm:px-8 sm:py-10">
              <p className="font-display text-4xl text-brand-300 sm:text-5xl">{item.value}</p>
              <h3 className="mt-3 text-lg font-semibold">{item.label}</h3>
              <p className="mt-2 text-sm text-white/60">{item.detail}</p>
            </div>
          ))}
        </div>

        <button type="button" className="btn-primary mt-10 w-full sm:mt-12 sm:w-auto" onClick={() => openBooking('an appointment')}>
          Join our clients
        </button>
      </div>
    </section>
  )
}

export default Stats
