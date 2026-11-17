import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { QueryProvider } from './providers/QueryProvider.tsx'
import { OnboardingDraftProvider } from './providers/OnboardingDraftProvider.tsx'

async function enableMockApi() {
  const mocksEnabled =
    import.meta.env.DEV &&
    (import.meta.env.VITE_ENABLE_MOCKS === 'true' ||
      import.meta.env.VITE_ENABLE_MOCKS === undefined)

  if (mocksEnabled) {
    const { worker } = await import('./mocks/browser.ts')
    await worker.start()
  }
}

enableMockApi().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <QueryProvider>
        <OnboardingDraftProvider>
          <App />
        </OnboardingDraftProvider>
      </QueryProvider>
    </StrictMode>,
  )
})
