import { brand } from '../data/content'

const Copyright = () => (
  <footer className="bg-[#14100e] text-white/60">
    <div className="mx-auto flex w-[min(92%,1200px)] flex-col items-center justify-between gap-3 py-6 text-center text-xs tracking-wider sm:flex-row sm:text-left">
      <p>
        Website by <span className="text-white">HimalayanCoder</span>
      </p>
      <p>© {new Date().getFullYear()} {brand.name}</p>
    </div>
  </footer>
)

export default Copyright
