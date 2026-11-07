import { FeatureCard } from "./FeatureCard.tsx";
import logo from "../../assets/credence_logo.png";

function ReminderIcon() {
  return (
    <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 24 24">
      <path
        d="M6.5 10.5a5.5 5.5 0 0 1 11 0v2.3l1.5 2.2h-14l1.5-2.2v-2.3Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
      <path
        d="M10 18.5h4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 24 24">
      <path
        d="m12 3 7 3v5.5c0 4.5-3 7.8-7 9.5-4-1.7-7-5-7-9.5V6l7-3Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
      <path
        d="m9 12 2 2 4-4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function AnalyticsIcon() {
  return (
    <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 24 24">
      <path
        d="M5 19V9M12 19V5M19 19v-7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
      <path
        d="M3 19h18"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

export function SignupValuePanel() {
  return (
    <section className="relative hidden min-h-screen overflow-hidden bg-[#102d2d] px-[clamp(32px,5vw,76px)] py-[clamp(34px,5vw,68px)] text-white lg:flex lg:w-[48%] lg:flex-col">
      <div className="pointer-events-none absolute -right-36 -top-32 size-110 rounded-full border border-[#769f88]/20" />
      <div className="pointer-events-none absolute -bottom-48 -left-40 size-130 rounded-full border border-[#769f88]/15" />

      <div className="relative z-10 flex items-center ">
        <img src={logo} height={65} width={65} className="rounded-full" />
        <span className="text-[32px] font-semibold tracking-tighter">
          redence
        </span>
      </div>

      <div className="relative z-10 mt-5 my-auto max-w-115">
        <h1 className="text-[clamp(2.10rem,3.0vw,4.10rem)]  font-bold leading-[1.08] tracking-[-0.055em]">
          Why businesses choose Credence
        </h1>

        <div className="mt-9 space-y-3">
          <FeatureCard
            icon={<ReminderIcon />}
            title="Automated reminders."
            description="Email + WhatsApp nudges on autopilot."
          />
          <FeatureCard
            icon={<ShieldIcon />}
            title="Credit capacity guardrails."
            description="Never over-extend beyond your limit."
          />
          <FeatureCard
            icon={<AnalyticsIcon />}
            title="Repayment intelligence."
            description="See who pays on time before you sell."
          />
        </div>
      </div>

      <p className="relative z-10 text-[11px] text-slate-400 mt-8">
        © 2026 Credence. Built for businesses that mean business.
      </p>
    </section>
  );
}
