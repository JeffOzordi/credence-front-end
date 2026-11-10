import { useState } from 'react'

export function NotificationButton() {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        aria-expanded={open}
        aria-label="Notifications, 3 unread"
        className="relative grid size-10 shrink-0 place-items-center rounded-xl border border-[#e3e8ee] bg-white text-[#52657a] transition hover:bg-[#f8fafc]"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <svg aria-hidden="true" className="size-4.5" fill="none" viewBox="0 0 24 24">
          <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9m-8 12h4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
        </svg>
        {!open && (
          <span className="absolute right-2 top-2 size-2 rounded-full bg-[#31b86b]" />
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-12 z-30 w-64 rounded-xl border border-[#e4e9ef] bg-white p-4 shadow-xl">
          <p className="text-sm font-semibold text-[#20354d]">Notifications</p>
          <p className="mt-2 text-xs leading-5 text-[#697b8e]">3 debtors have upcoming payments. Review your reminders to stay ahead.</p>
          <button className="mt-3 text-xs font-semibold text-[#228c52] hover:underline" onClick={() => setOpen(false)} type="button">Got it</button>
        </div>
      )}
    </div>
  )
}
