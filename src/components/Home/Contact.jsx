import { IoCall, IoMail, IoLocationSharp } from 'react-icons/io5'
import { MdOutlineFacebook } from 'react-icons/md'
import { RiInstagramFill, RiWhatsappFill } from 'react-icons/ri'
import { logoImages } from '../../utils/imageImports'
import { brand, contact, mailUrl, telUrl, whatsappUrl } from '../../data/content'

const actions = [
  { label: 'FB', name: 'Facebook', icon: MdOutlineFacebook, soon: true },
  { label: 'IG', name: 'Instagram', icon: RiInstagramFill, soon: true },
  {
    label: 'WA',
    name: 'WhatsApp',
    icon: RiWhatsappFill,
    href: whatsappUrl(),
    external: true,
    accent: 'hover:text-[#25D366]',
  },
  { label: 'Call', name: 'Call', icon: IoCall, href: telUrl },
  { label: 'Email', name: 'Email', icon: IoMail, href: mailUrl },
  {
    label: 'Visit',
    name: 'Visit',
    icon: IoLocationSharp,
    href: contact.mapsUrl,
    external: true,
  },
]

const Contact = () => (
  <section id="contact" className="scroll-target bg-ink text-white">
    <div className="mx-auto w-[min(92%,760px)] py-9 sm:py-14 lg:py-24">
      <article className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-panel shadow-card sm:rounded-[2rem]">
        <div className="px-5 pb-6 pt-6 sm:px-8 sm:pb-8 sm:pt-8">
          <p className="section-badge">{brand.locationShort}</p>
          <img
            src={logoImages.wordmark}
            alt={brand.name}
            className="mt-4 h-12 w-auto object-contain sm:mt-5 sm:h-16"
          />
          <h2 className="sr-only">{brand.name}</h2>
          <p className="mt-3 text-sm leading-relaxed text-white/70 sm:mt-4 sm:text-base">
            {brand.owner} and {brand.assistant} — walk in, call, or send a WhatsApp. We will take it from there.
          </p>
        </div>

        <div className="grid grid-cols-6 border-t border-white/10 bg-black/25">
          {actions.map((item) => {
            const Icon = item.icon
            const className = `flex flex-col items-center justify-center gap-1.5 py-4 text-white/85 transition sm:py-5 ${
              item.soon ? 'cursor-default text-white/35' : `hover:bg-white/5 ${item.accent || 'hover:text-brand-300'}`
            }`

            const inner = (
              <>
                <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="text-[8px] font-medium uppercase tracking-[0.12em] text-white/45 sm:text-[10px]">
                  <span className="sm:hidden">{item.label}</span>
                  <span className="hidden sm:inline">{item.name}</span>
                </span>
              </>
            )

            if (item.soon) {
              return (
                <span key={item.name} title={`${item.name} coming soon`} className={className}>
                  {inner}
                </span>
              )
            }

            return (
              <a
                key={item.name}
                href={item.href}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noreferrer' : undefined}
                aria-label={item.name}
                className={className}
              >
                {inner}
              </a>
            )
          })}
        </div>
      </article>
    </div>
  </section>
)

export default Contact
