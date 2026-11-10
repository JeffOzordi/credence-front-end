import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { QueryProvider } from './providers/QueryProvider.tsx'
import { OnboardingDraftProvider } from './providers/OnboardingDraftProvider.tsx'

async function enableMockApi() {
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser.ts')
    await worker.start({ onUnhandledRequest: 'bypass' })
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
