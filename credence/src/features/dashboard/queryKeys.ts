export const dashboardQueryKeys = {
  all: ['dashboard'] as const,
  overview: (simulateError = false) =>
    [...dashboardQueryKeys.all, 'overview', { simulateError }] as const,
}
