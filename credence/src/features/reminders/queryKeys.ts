export const reminderQueryKeys = {
  all: ['reminders'] as const,
  lists: () => [...reminderQueryKeys.all, 'list'] as const,
}
