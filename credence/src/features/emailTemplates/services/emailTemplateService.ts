import { defaultEmailTemplates, type EmailTemplate } from '../data/emailTemplates.ts'

const STORAGE_KEY = 'credence.mock-email-templates.v1'

function readTemplates(): EmailTemplate[] {
  if (typeof window === 'undefined') return defaultEmailTemplates
  try {
    const stored = window.sessionStorage.getItem(STORAGE_KEY)
    if (!stored) return defaultEmailTemplates
    const parsed = JSON.parse(stored) as unknown
    if (!Array.isArray(parsed)) return defaultEmailTemplates
    return parsed as EmailTemplate[]
  } catch {
    return defaultEmailTemplates
  }
}

export async function listEmailTemplates(): Promise<EmailTemplate[]> {
  await new Promise((resolve) => setTimeout(resolve, 120))
  return readTemplates()
}

export async function saveEmailTemplates(templates: EmailTemplate[]): Promise<EmailTemplate[]> {
  await new Promise((resolve) => setTimeout(resolve, 120))
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(templates))
  return templates
}
