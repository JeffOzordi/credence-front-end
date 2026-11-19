import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { reminderQueryKeys } from '../queryKeys.ts'
import { cancelReminder, createReminder, listReminders, triggerReminder } from '../services/reminderService.ts'
import type { NewReminder } from '../types.ts'

export function useReminders() {
  return useQuery({
    queryKey: reminderQueryKeys.lists(),
    queryFn: listReminders,
  })
}

export function useCreateReminder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: NewReminder) => createReminder(input),
    onSuccess: (reminders) => queryClient.setQueryData(reminderQueryKeys.lists(), reminders),
  })
}

export function useCancelReminder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => cancelReminder(id),
    onSuccess: (reminders) => queryClient.setQueryData(reminderQueryKeys.lists(), reminders),
  })
}

export function useTriggerReminder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => triggerReminder(id),
    onSuccess: (reminders) => queryClient.setQueryData(reminderQueryKeys.lists(), reminders),
  })
}
