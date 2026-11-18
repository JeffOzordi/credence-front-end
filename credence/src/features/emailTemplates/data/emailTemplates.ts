export type EmailTemplate = {
  id: string
  name: string
  subject: string
  message: string
}

export const defaultEmailTemplates: EmailTemplate[] = [
  {
    id: 'upcoming-payment',
    name: 'Upcoming payment',
    subject: 'Upcoming payment: {{invoice_number}} due {{due_date}}',
    message: 'Dear {{debtor_name}},\n\nInvoice {{invoice_number}} for {{transaction_amount}} from {{business_name}} is due on {{due_date}}.\n\nAmount paid: {{amount_paid}} • Outstanding: {{outstanding_balance}}\n\nThank you.',
  },
  {
    id: 'payment-due',
    name: 'Payment due today',
    subject: 'Payment due today: {{invoice_number}}',
    message: 'Dear {{debtor_name}},\n\nInvoice {{invoice_number}} is due today. The outstanding balance is {{outstanding_balance}}.\n\nPay securely here: {{payment_link}}',
  },
  {
    id: 'first-overdue',
    name: 'First overdue reminder',
    subject: 'Overdue: {{outstanding_balance}} for {{invoice_number}} — action needed',
    message: 'Dear {{debtor_name}},\n\nThis is a friendly reminder that invoice {{invoice_number}} ({{transaction_amount}}) from {{business_name}} was due on {{due_date}}.\n\nAmount paid: {{amount_paid}} • Outstanding: {{outstanding_balance}}\n\nPay securely here: {{payment_link}}\n\nThank you for your prompt attention.',
  },
  {
    id: 'subsequent-overdue',
    name: 'Subsequent overdue',
    subject: 'Follow-up required: {{invoice_number}}',
    message: 'Dear {{debtor_name}},\n\nWe are following up on invoice {{invoice_number}}. The outstanding balance remains {{outstanding_balance}}.\n\nPlease arrange payment or contact us to discuss it.',
  },
  {
    id: 'formal-notice',
    name: 'Formal payment notice',
    subject: 'Formal payment notice — {{invoice_number}}',
    message: 'Dear {{debtor_name}},\n\nDespite previous reminders, invoice {{invoice_number}} remains unpaid. Outstanding balance: {{outstanding_balance}}.\n\nPlease settle or respond with a repayment proposal.',
  },
  {
    id: 'payment-confirmation',
    name: 'Payment confirmation',
    subject: 'Payment received: {{invoice_number}}',
    message: 'Dear {{debtor_name}},\n\nWe confirm receipt of a payment toward {{invoice_number}}. Outstanding balance: {{outstanding_balance}}.\n\nThank you.',
  },
  {
    id: 'settlement',
    name: 'Transaction settlement',
    subject: 'Invoice settled: {{invoice_number}}',
    message: 'Dear {{debtor_name}},\n\nInvoice {{invoice_number}} is now settled. Thank you for completing the payment.',
  },
]
