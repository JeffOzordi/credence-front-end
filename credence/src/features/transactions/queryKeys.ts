export const transactionQueryKeys = {
  all: ['transactions'] as const,
  lists: () => [...transactionQueryKeys.all, 'list'] as const,
  detail: (transactionId: string) =>
    [...transactionQueryKeys.all, 'detail', transactionId] as const,
  debtors: () => [...transactionQueryKeys.all, 'debtors'] as const,
}
