const nairaFormatter = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  maximumFractionDigits: 0,
})

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

export function formatNaira(amount: number) {
  return nairaFormatter.format(amount)
}

export function formatTransactionDate(date: string) {
  return dateFormatter.format(new Date(`${date}T00:00:00`))
}
