import { useEffect, useRef } from 'react'
import { Sidebar } from './Sidebar.tsx'

type MobileSidebarProps = {
  open: boolean
  onClose: () => void
}

export function MobileSidebar({ open, onClose }: MobileSidebarProps) {
  const dialogRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!open) return

    const previousFocus = document.activeElement
    const firstFocusable = dialogRef.current?.querySelector<HTMLElement>(
      'button, a[href]',
    )
    firstFocusable?.focus()

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      } else if (event.key === 'Tab' && dialogRef.current) {
        const focusable = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>('button, a[href]'),
        )
        const first = focusable[0]
        const last = focusable[focusable.length - 1]

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last?.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first?.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      if (previousFocus instanceof HTMLElement) previousFocus.focus()
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        aria-label="Close navigation backdrop"
        className="absolute inset-0 h-full w-full cursor-default bg-[#0b1c2f]/55"
        onClick={onClose}
        tabIndex={-1}
        type="button"
      />
      <section
        aria-label="Mobile dashboard navigation"
        aria-modal="true"
        className="relative flex h-full max-h-dvh w-[min(84vw,300px)] flex-col shadow-2xl"
        ref={dialogRef}
        role="dialog"
      >
        <button
          aria-label="Close navigation"
          className="absolute right-3 top-3 z-10 grid size-8 place-items-center rounded-md bg-white/10 text-white hover:bg-white/20"
          onClick={onClose}
          type="button"
        >
          <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 24 24">
            <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
          </svg>
        </button>
        <Sidebar onNavigate={onClose} />
      </section>
    </div>
  )
}
