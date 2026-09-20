import { RiWhatsappFill } from 'react-icons/ri'
import { whatsappUrl } from '../data/content'

const WhatsAppButton = () => (
  <a
    href={whatsappUrl()}
    target="_blank"
    rel="noreferrer"
    aria-label="Book on WhatsApp"
    className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 transition hover:scale-105"
  >
    <RiWhatsappFill className="h-7 w-7" />
  </a>
)

export default WhatsAppButton
