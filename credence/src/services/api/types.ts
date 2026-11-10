export type RegisterRequest = {
  businessName: string
  fullName: string
  email: string
  password: string
}

export type RegisterResponse = {
  userId: string
  businessId: string
  message: string
}

export type BusinessInfo = {
  category: string
  otherCategory?: string
  phoneNumber: string
  registrationNumber: string
  address: string
}

export type BusinessOnboardingRequest = BusinessInfo

export type BusinessOnboardingResponse = {
  businessId: string
  message: string
  businessInfo: BusinessInfo
}

export type DashboardStat = {
  title: string
  value: string
  description: string
  tone: 'navy' | 'amber' | 'green' | 'red' | 'blue'
  icon: 'credit' | 'outstanding' | 'collected' | 'overdue' | 'capacity'
}

export type Transaction = {
  debtor: string
  reference: string
  amount: string
  paid: string
  dueDate: string
  status: 'Partially paid' | 'Overdue' | 'Settled' | 'Active'
}

export type OverduePayment = {
  debtor: string
  amount: string
  daysOverdue: number
  lastCommunication: string
  nextFollowUp: string
}

export type CollectionMonth = {
  month: string
  amount: number
  rate: string
}

export type DashboardActivity = {
  type: 'payment' | 'reminder' | 'transaction' | 'response' | 'plan'
  title: string
  detail: string
  time: string
}

export type UpcomingPayment = {
  debtor: string
  dueDate: string
  amount: string
}

export type DashboardOverview = {
  stats: DashboardStat[]
  creditHealth: {
    label: string
    percentage: number
    dueAmount: string
    dueDebtorCount: number
    message: string
  }
  transactions: Transaction[]
  overduePayments: OverduePayment[]
  collectionPerformance: {
    months: CollectionMonth[]
    totalCollected: string
    rate: string
  }
  activities: DashboardActivity[]
  upcomingPayments: UpcomingPayment[]
}

export type ApiErrorResponse = {
  message: string
}
