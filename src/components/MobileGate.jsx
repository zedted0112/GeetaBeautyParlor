import { brand } from '../data/content'
import { logoImages } from '../utils/imageImports'

const MobileGate = () => (
  <div className="mobile-gate" role="dialog" aria-modal="true" aria-labelledby="mobile-gate-title">
    <img src={logoImages.primary} alt="" className="h-16 w-16 object-contain brightness-0 invert" />
    <p className="section-badge">Geeta Makeovers</p>
    <h1 id="mobile-gate-title" className="font-display text-4xl text-ivory">
      Open this on your phone
    </h1>
    <p className="max-w-md text-sm leading-relaxed text-ivory/70">
      The {brand.name} site is a mobile studio for now. Please visit from your phone to book, watch reels, and see the looks.
    </p>
  </div>
)

export default MobileGate
