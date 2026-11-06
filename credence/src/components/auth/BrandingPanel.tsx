import { StatCard } from './StatCard.tsx'
import logo  from '../../assets/credence_logo.png'


export function BrandingPanel() {
  return (
    
<section className="relative hidden min-h-110 flex-col overflow-hidden bg-[#102d2d] px-6 py-7 text-white sm:px-10 sm:py-9 md:flex md:min-h-screen md:w-[56%] md:px-[clamp(40px,6vw,92px)] md:py-[clamp(38px,4vw,64px)]">
      <div className="pointer-events-none absolute -right-36 -top-32 size-110 rounded-full border border-[#769f88]/20" />
      <div className="pointer-events-none absolute -bottom-48 -left-40 size-130 rounded-full border border-[#769f88]/15" />

      <div className="relative z-10 flex items-center gap-3">
        <img src={logo} height={75} width={75} className='rounded-full'/>
        <div className="flex-d">
          <span className="text-[22px] font-semibold tracking-tighter">Credence</span>
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#a5d6b2]">
          Make trust measurable.
        </p>
        </div>
      </div>

      <div className="relative z-10 mt-16 max-w-142.5 sm:mt-20 lg:mt-auto">
        <h1 className="max-w-140 text-[clamp(2.10rem,3.2vw,4.10rem)] font-bold leading-[1.2] tracking-normal text-white">
          Know who owes you.
          <br />
          Collect on time, every time.
        </h1>
      </div>

      <div className="relative z-10 mt-12 max-w-155 sm:mt-16 lg:mb-12 lg:mt-20">
        <div className="flex border-y border-white/15 py-5">
          <StatCard value="₦2.4B+" label="Credit tracked monthly" />
          <StatCard value="94%" label="On-time collection rate" />
          <StatCard value="6,200+" label="Businesses on Credence" />
        </div>
        </div>
        <div>

        <blockquote className="mt-6 rounded-2xl bg-white px-5 py-5 text-[#183333] shadow-[0_18px_50px_rgba(0,0,0,0.14)] sm:px-6">
          <p className="max-w-127.5 text-sm font-medium leading-6">
            “Credence gives us the clarity to follow up with confidence. We collect faster and spend less time chasing.”
          </p>
          <footer className="mt-4 flex items-center gap-3 text-xs text-[#6b7b76]">
            <span className="grid size-7 place-items-center rounded-full bg-[#d6eadb] font-semibold text-[#2d5a48]">
              AO
            </span>
            <span>
              <strong className="font-semibold text-[#29443e]">Amaka Okafor</strong>
              <span className="ml-1">· Founder, Aster Works</span>
            </span>
          </footer>
        </blockquote>
      </div>

      <p className="relative z-10 mt-10 text-[11px] text-slate-400 lg:mt-auto">
        © 2026 Credence. Built for businesses that mean business.
      </p>
    </section>
  )
}
