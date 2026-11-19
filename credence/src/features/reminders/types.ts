export type ReminderStatus = 'Sent' | 'Scheduled' | 'Failed' | 'Cancelled'
export type ReminderChannel = 'Email' | 'WhatsApp'
export type ReminderType = 'Overdue' | 'Due today' | 'Upcoming' | 'After due date'

export type Reminder = {
  id: string
  debtorId: string
  debtorName: string
  transactionId: string
  transactionReference: string
  amount: number
  type: ReminderType
  scheduledAt: string
  channel: ReminderChannel
  status: ReminderStatus
  response: 'Responded' | 'No response' | '—'
  simulated: boolean
}

export type NewReminder = {
  transactionId: string
  debtorId: string
  debtorName: string
  transactionReference: string
  amount: number
  type: ReminderType
  scheduledAt: string
  channel: ReminderChannel
}
