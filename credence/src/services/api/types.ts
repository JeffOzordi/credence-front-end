
export type BusinessCategory =
  | 'banking_financial_services'
  | 'microfinance'
  | 'fintech_digital_lending'
  | 'cooperatives_credit_unions'
  | 'wholesale_distribution'
  | 'manufacturing'
  | 'retail_ecommerce'
  | 'education'
  | 'healthcare'
  | 'real_estate_property_management'
  | 'logistics_transportation'
  | 'equipment_leasing_rentals'
  | 'agriculture_agribusiness'
  | 'professional_services'
  | 'utilities_telecommunications'
  | 'other'

export type RegisterRequest = {
  email: string
  password: string
  business_name: string
  registration_number: string
  phone: string
  address: string
  category: BusinessCategory
}

export type RegisterResponse = {
  user: {
    id: string
    email: string
  }
  access_token: string
  token_type: string
}

export type LoginRequest = {
  email: string
  password: string
}

export type LoginResponse = unknown

export type CurrentBusiness = {
  id: string
  name: string
  email: string
  phone: string
  address: string
  registration_number: string
  category: BusinessCategory
}

export type BusinessInfo = {
  category: BusinessCategory | ''
  phoneNumber: string
  registrationNumber: string
  address: string
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
