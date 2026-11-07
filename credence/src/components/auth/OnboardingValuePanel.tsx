import { FeatureCard } from "./FeatureCard.tsx";
import logo from "../../assets/credence_logo.png";

function SparkIcon() {
  return (
    <span aria-hidden="true" className="text-lg">
      ✦
    </span>
  );
}

function ControlIcon() {
  return (
    <span aria-hidden="true" className="text-lg">
      ⌁
    </span>
  );
}

function CollectionIcon() {
  return (
    <span aria-hidden="true" className="text-lg">
      ↗
    </span>
  );
}

export function OnboardingValuePanel() {
  return (
    <section className="relative flex min-h-0 w-full flex-col overflow-hidden bg-[#193452] px-5 py-10 text-white sm:px-10 lg:min-h-screen lg:w-[48%] lg:px-[clamp(32px,5vw,76px)] lg:py-[clamp(34px,5vw,68px)]">
      <div className="pointer-events-none absolute -right-36 -top-32 size-110 rounded-full border border-[#8cb5c9]/20" />
      <div className="pointer-events-none absolute -bottom-48 -left-40 size-130 rounded-full border border-[#8cb5c9]/15" />
      <div className="relative z-10 flex items-center ">
        <img src={logo} height={65} width={65} className="rounded-full" />
        <span className="text-[32px] font-semibold tracking-tighter">
          redence
        </span>
      </div>
      <div className="relative z-10 my-auto max-w-115">
        <h1 className="text-[clamp(2rem,3vw,3.35rem)] font-bold leading-[1.08] tracking-[-0.055em]">
          Make better credit decisions.
        </h1>
        <p className="mt-4 max-w-100 text-sm leading-6 text-[#c2d0db]">
          Credence helps businesses manage credit, monitor repayments and make
          informed collection decisions.
        </p>
        <div className="mt-8 space-y-3">
          <FeatureCard
            icon={<SparkIcon />}
            title="Know your customers"
            description="Understand customer credit activity and repayment behaviour."
          />
          <FeatureCard
            icon={<ControlIcon />}
            title="Stay in control"
            description="Monitor outstanding balances and manage credit exposure."
          />
          <FeatureCard
            icon={<CollectionIcon />}
            title="Collect with confidence"
            description="Track repayments and stay ahead of overdue accounts."
          />
        </div>
      </div>
      <p className="relative z-10 mt-8 text-[11px] text-slate-300">
        © 2026 Credence. Built for businesses that mean business.
      </p>
    </section>
  );
}
