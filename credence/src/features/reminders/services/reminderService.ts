import { mockReminders } from '../data/mockReminders.ts'
import type { NewReminder, Reminder } from '../types.ts'

const REMINDERS_KEY = 'credence.mock-reminders.v1'

function readStored(): Reminder[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = window.sessionStorage.getItem(REMINDERS_KEY)
    if (!stored) return []
    const parsed = JSON.parse(stored) as unknown
    return Array.isArray(parsed) ? parsed as Reminder[] : []
  } catch {
    return []
  }
}

function writeStored(reminders: Reminder[]) {
  if (typeof window !== 'undefined') {
    window.sessionStorage.setItem(REMINDERS_KEY, JSON.stringify(reminders))
  }
}

function getAll(): Reminder[] {
  const combined = new Map(mockReminders.map((reminder) => [reminder.id, reminder]))
  for (const reminder of readStored()) {
    combined.set(reminder.id, reminder)
  }
  return [...combined.values()]
}

const wait = () => new Promise<void>((resolve) => setTimeout(resolve, 120))

export async function listReminders(): Promise<Reminder[]> {
  await wait()
  return getAll()
}

export async function createReminder(input: NewReminder): Promise<Reminder[]> {
  await wait()
  const reminder: Reminder = {
    id: `mock-reminder-${crypto.randomUUID()}`,
    ...input,
    status: 'Scheduled',
    response: '—',
    simulated: true,
  }
  const next = [...readStored(), reminder]
  writeStored(next)
  return getAll()
}

export async function cancelReminder(reminderId: string): Promise<Reminder[]> {
  await wait()
  const next = getAll().map((reminder) =>
    reminder.id === reminderId ? { ...reminder, status: 'Cancelled' as const } : reminder,
  )
  writeStored(next)
  return next
}

export async function triggerReminder(reminderId: string): Promise<Reminder[]> {
  await wait()
  const next = getAll().map((reminder) =>
    reminder.id === reminderId
      ? { ...reminder, status: 'Sent' as const, simulated: true }
      : reminder,
  )
  writeStored(next)
  return next
}
