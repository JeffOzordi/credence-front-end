export const debtorQueryKeys = {
  all: ['debtors'] as const,
  lists: () => [...debtorQueryKeys.all, 'list'] as const,
  detail: (debtorId: string) =>
    [...debtorQueryKeys.all, 'detail', debtorId] as const,
}
