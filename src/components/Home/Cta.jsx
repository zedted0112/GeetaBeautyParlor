import { serviceImages } from '../../utils/imageImports'
import { brand, contact, telUrl, whatsappUrl } from '../../data/content'

const Cta = () => (
  <section
    className="relative overflow-hidden bg-cover bg-center"
    style={{ backgroundImage: `url('${serviceImages.makeup.glamour}')` }}
  >
    <div className="absolute inset-0 bg-black/75" />
    <div className="relative mx-auto flex w-[min(92%,900px)] flex-col items-center py-20 text-center text-white lg:py-24">
      <p className="section-badge-light">Your next look</p>
      <h2 className="mt-5 font-display text-4xl font-semibold lg:text-5xl">
        Ready when you are
      </h2>
      <p className="mt-4 max-w-xl text-lg text-white/75">
        Message {brand.owner} on WhatsApp or call the studio. We will find a time that fits your day.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <a href={whatsappUrl()} target="_blank" rel="noreferrer" className="btn-primary">
          WhatsApp {contact.phoneDisplay}
        </a>
        <a href={telUrl} className="btn-secondary">
          Call the studio
        </a>
      </div>
    </div>
  </section>
)

export default Cta
