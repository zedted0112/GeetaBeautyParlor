import { IoCall, IoMail, IoLocationSharp } from 'react-icons/io5'
import { MdOutlineFacebook } from 'react-icons/md'
import { RiInstagramFill, RiWhatsappFill } from 'react-icons/ri'
import { logoImages } from '../../utils/imageImports'
import { brand, contact, mailUrl, telUrl, whatsappUrl } from '../../data/content'

const cards = [
  {
    label: 'Call',
    value: contact.phoneDisplay,
    href: telUrl,
    icon: IoCall,
  },
  {
    label: 'WhatsApp',
    value: contact.phoneDisplay,
    href: whatsappUrl(),
    icon: RiWhatsappFill,
    external: true,
    accent: 'hover:border-[#25D366] hover:text-[#25D366]',
  },
  {
    label: 'Email',
    value: contact.email,
    href: mailUrl,
    icon: IoMail,
  },
  {
    label: 'Visit',
    value: contact.address,
    href: contact.mapsUrl,
    icon: IoLocationSharp,
    external: true,
  },
]

const Contact = () => (
  <section id="contact" className="scroll-target bg-ink text-white">
    <div className="mx-auto w-[min(92%,1200px)] py-20 lg:py-24">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-xl">
          <img
            src={logoImages.wordmark}
            alt={brand.name}
            className="mb-6 h-20 w-auto object-contain sm:h-24"
          />
          <h2 className="sr-only">{brand.name}</h2>
          <p className="mt-4 text-lg leading-relaxed text-white/70">
            {brand.owner} and {brand.assistant} — beauty consultants in {brand.location}.
            Walk in, call, or send a WhatsApp. We will take it from there.
          </p>
        </div>
        <div className="flex gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/50" title="Facebook coming soon">
            <MdOutlineFacebook className="h-5 w-5" />
          </span>
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/50" title="Instagram coming soon">
            <RiInstagramFill className="h-5 w-5" />
          </span>
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noreferrer"
            aria-label="WhatsApp"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition hover:border-[#25D366] hover:text-[#25D366]"
          >
            <RiWhatsappFill className="h-5 w-5" />
          </a>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <a
              key={card.label}
              href={card.href}
              target={card.external ? '_blank' : undefined}
              rel={card.external ? 'noreferrer' : undefined}
              title={card.value}
              aria-label={`${card.label}: ${card.value}`}
              className={`flex flex-col items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-8 text-ivory/90 transition hover:border-brand-400 hover:bg-white/10 ${card.accent || ''}`}
            >
              <Icon className="h-8 w-8" />
              <span className="text-xs uppercase tracking-[0.16em] text-ivory/60">{card.label}</span>
            </a>
          )
        })}
      </div>
    </div>
  </section>
)

export default Contact
