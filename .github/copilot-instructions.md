# Credence Engineering Guidelines

## Project Overview

Credence is a startup product whose interface should follow the Banani design reference as its visual source of truth:
https://app.banani.co/preview/hoQzTZG67ape?screen=01-login

The application currently lives in `credence/` and is a minimal React starter. Preserve existing behavior and conventions before introducing new patterns. Ask before making major architectural decisions, adding dependencies, or assuming backend/API contracts.

## Current Technology and Architecture

- React 19 with React DOM and TypeScript 6.
- Vite 8 with `@vitejs/plugin-react`.
- The React Compiler is enabled in `vite.config.ts`; keep code compatible with it.
- ESLint 10 uses the flat configuration in `credence/eslint.config.js`.
- TypeScript uses bundler module resolution, strict unused-local/parameter checks, `react-jsx`, and no emit.
- The current entry point is `credence/src/main.tsx`, which renders `App` in `StrictMode`.
- The current UI is a starter screen in `credence/src/App.tsx`, with global styles in `credence/src/index.css` and component styles in `credence/src/App.css`.
- Tailwind CSS is configured through the official `@tailwindcss/vite` plugin and imported from `credence/src/index.css`.
- TanStack Query is installed as `@tanstack/react-query`; the shared `QueryClient` is provided by `credence/src/providers/QueryProvider.tsx`.
- No backend, API client, routing, or server-state architecture has been established. Do not invent endpoints, response shapes, or persistence behavior.

## Component Organization and Reuse

- Keep `App.tsx` focused on composition; extract components when a unit has a clear responsibility or is reused.
- Prefer feature-oriented organization as the product grows, keeping related components, hooks, types, and tests together.
- Keep presentational components independent of data-fetching details where practical.
- Prefer small, composable components over premature design-system abstractions.
- Reuse existing components, utilities, styles, and patterns before creating alternatives.

## React and Hooks

- Use function components and standard React hooks.
- Keep state as close as possible to the components that own it; lift it only when siblings need to coordinate.
- Keep effects for synchronization with external systems, not derived values or ordinary event handling.
- Declare complete hook dependencies and avoid suppressing lint rules without a documented reason.
- Provide stable, semantic keys for lists and avoid index keys when items can be reordered.
- Preserve `StrictMode` compatibility and avoid render-time side effects.

## Styling and Design

- Treat the Banani reference as the visual source of truth for layout, typography, spacing, color, interaction, and responsive behavior.
- Existing CSS conventions in `credence/src/index.css` and `credence/src/App.css` take precedence until a deliberate styling migration is approved.
- Use Tailwind utilities consistently, keep repeated patterns composable, and avoid arbitrary values when a shared token or existing utility expresses the design.
- Keep design tokens centralized and use the established CSS variables or an approved token system instead of scattering literal colors, spacing, and typography values.
- Prefer semantic HTML and predictable responsive breakpoints. Validate mobile, tablet, and desktop layouts against the reference.

## TanStack Query and API Interactions

- Use the shared `QueryClient` and `QueryClientProvider` from `credence/src/providers/QueryProvider.tsx` at the application boundary.
- Use query keys that include every input affecting a request, and centralize key factories where they become shared.
- Keep request functions and response types separate from components. Do not fetch in effects when a query is the appropriate abstraction.
- Set cache and stale times intentionally based on data behavior; do not disable caching by default.
- Use mutations for writes, expose pending/error states, and invalidate or update affected queries after successful mutations.
- Do not infer API URLs, authentication, error formats, retries, or response schemas. Confirm them before implementing an API layer.

## TypeScript

- Keep types explicit at public component, hook, and API boundaries; allow local inference when it is clear.
- Prefer narrow unions and discriminated states over loosely typed objects.
- Avoid `any`, unsafe casts, non-null assertions, and broad type suppression. Fix the underlying type or add a runtime guard.
- Keep imports type-safe and follow `verbatimModuleSyntax`.
- Respect the configured `noUnusedLocals` and `noUnusedParameters` checks.

## Naming and Readability

- Use PascalCase for React components and component files, camelCase for functions, hooks, variables, and utilities, and descriptive singular nouns for types.
- Prefix custom hooks with `use`.
- Name event handlers by intent, such as `handleSubmit`, rather than implementation details.
- Prefer early returns and straightforward control flow. Keep functions focused and avoid abstractions that do not remove real duplication.
- Match the repository's existing formatting, import style, and naming before introducing a new convention.

## Loading, Errors, and Accessibility

- Every asynchronous surface must represent loading, success, empty, and error states as applicable.
- Show actionable user-facing error messages and preserve useful diagnostic context in logs or established error reporting; do not silently swallow failures.
- Disable or otherwise protect controls during pending mutations where duplicate submissions would be harmful.
- Use semantic landmarks, heading hierarchy, labels, keyboard-accessible controls, visible focus states, and meaningful alternative text.
- Ensure sufficient contrast, responsive touch targets, and support for reduced motion where animation is introduced.

## Validation and Change Discipline

- Do not install dependencies, generate pages/components, or modify application code unless the task explicitly asks for it.
- Before changing architecture, styling infrastructure, data fetching, or routing, explain the trade-offs and ask for approval.
- Run the smallest relevant existing validation command after code changes: `npm run lint` and/or `npm run build` from `credence/`.
- Update directly related documentation when established conventions change.
