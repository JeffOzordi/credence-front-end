import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { EmailTemplate } from '../data/emailTemplates.ts'
import { listEmailTemplates, saveEmailTemplates } from '../services/emailTemplateService.ts'

export function useEmailTemplates() {
  return useQuery({
    queryKey: ['email-templates'],
    queryFn: listEmailTemplates,
  })
}

export function useSaveEmailTemplates() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (templates: EmailTemplate[]) => saveEmailTemplates(templates),
    onSuccess: (templates) => queryClient.setQueryData(['email-templates'], templates),
  })
}
