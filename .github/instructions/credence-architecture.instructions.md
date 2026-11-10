---
description: "Use when adding or changing Credence application architecture, React components, API services, TanStack Query, state management, TypeScript types, async UI, or Tailwind styling."
applyTo: "credence/src/**/*.{ts,tsx,css}"
---

# Credence Architecture Guidelines

Follow the existing Credence architecture. Keep changes consistent with nearby code; do not introduce dependencies, backend contracts, or architectural patterns without an explicit requirement.

## Project and feature organization

- Keep application entry points, providers, routes, and shared layouts in their existing top-level locations under `credence/src/`.
- Organize domain-specific code by feature under `features/<feature>/`. Keep a feature’s hooks, query keys, and feature-only components together when that makes ownership clearer.
- Put genuinely shared UI in `components/`, route-level screens in `pages/`, and transport and API service code in `services/api/`.
- Do not reorganize files solely to enforce uniformity. In particular, preserve existing locations such as `components/auth/` unless a specific change justifies moving them.
- Use `features/dashboard/` and `features/onboarding/` as current examples of feature organization.

## Components and pages

- Keep `App.tsx` focused on application composition. Keep route-specific composition in pages and shared shell behavior in layouts.
- Keep presentational components independent of data-fetching details where practical. Pass required data and callbacks through props.
- Extract a component when it has a meaningful responsibility, is reused, or makes its parent’s role clearer. **Do not extract components based on file length alone.**
- Keep small presentation helpers local to a feature when they are not meaningfully reusable.
- Follow the existing route composition in `routes/index.tsx`, layout separation in `layouts/`, and dashboard composition in `pages/dashboard/OverviewPage.tsx`.

## API client and services

- Use the shared Axios client in `services/api/apiClient.ts`. Do not create additional Axios instances without a specific requirement.
- Add endpoint paths to `services/api/endpoints.ts` and implement domain request functions in the appropriate service module, such as `services/api/authentication.ts` or `services/api/dashboard.ts`.
- Keep Axios calls, URL construction, and request/response mapping out of components.
- Define request and response types explicitly at API boundaries. Do not invent endpoints, response shapes, authentication behavior, or error formats; confirm the backend contract first.
- Do not treat Axios generic types as runtime validation of response data.

## TanStack Query and custom hooks

- Use the shared `QueryClient` and provider in `providers/QueryProvider.tsx`.
- Use `useQuery` for server reads and `useMutation` for writes. Keep request functions in API services and use feature hooks to connect them to TanStack Query.
- Do not fetch in effects when a query or mutation is the appropriate abstraction.
- Keep query hooks focused on server-state access. Render loading, error, and success UI at the page or feature-component layer.
- Use `features/dashboard/hooks/useDashboardOverview.ts` and `features/onboarding/hooks/` as examples of feature hooks.
- Set query-specific options only when they intentionally differ from shared defaults. Do not repeat provider defaults without a data-specific reason.
- After mutations, invalidate or update affected queries when relevant cached server data exists.

## Query keys and caching

- Include every request input that can change the returned data in the query key.
- Use a feature query-key factory when it meaningfully centralizes related keys, supports consistent invalidation, or prevents key mismatches. **Do not add a factory for its own sake.**
- Use `features/dashboard/queryKeys.ts` as an example of a factory associated with an active query.
- Define stale and garbage-collection times intentionally, using provider defaults unless a query has a clear reason to differ.
- Keep query keys aligned with the actual resource and request parameters.

## Local, shared, and server state

- Keep remote/server data in TanStack Query; do not mirror it in component state or a global store without a specific need.
- Keep interaction state local to the component that owns it. Lift it to a layout or shared provider only when multiple related components need it.
- Use context for bounded state shared across a workflow, as in `providers/OnboardingDraftProvider.tsx`.
- Do not add a global state library unless a concrete cross-feature state requirement cannot be handled clearly with existing patterns.
- **Do not introduce onboarding draft persistence** (including browser storage) without an explicit product requirement and agreement on the handling of the data.

## TypeScript

- Define explicit types for public component props, hooks, and API boundaries. Use local inference where the type is clear.
- Prefer narrow unions for finite states and values, as in the dashboard types in `services/api/types.ts`.
- Keep imports type-safe and follow the project’s `verbatimModuleSyntax` configuration.
- Avoid `any`, unsafe casts, non-null assertions, and broad type suppression. Guard or validate values that can be absent or invalid at runtime.
- Keep domain types with their current owner; split `services/api/types.ts` only when doing so improves feature ownership or navigation.

## Asynchronous UI states

- Represent loading, success, and error states for every asynchronous surface; include a distinct empty state when a successful result can contain no items.
- Use the established dashboard loading and error UI in `features/dashboard/components/DashboardLoading.tsx` and `pages/dashboard/OverviewPage.tsx` as examples.
- Show a useful pending state and prevent harmful duplicate submissions while mutations are pending.
- Make status perceivable to assistive technology. Keep retry actions available when retrying is meaningful.
- Do not present an empty result as a loading or error state.

## Error handling and API responses

- Use the API interceptor in `services/api/interceptors.ts` to normalize transport errors. Keep server-specific response interpretation at the API boundary.
- **Components and feature UI must not independently interpret Axios errors. They should consume the normalized errors exposed by the API/service layer and display appropriate user-facing messages.**
- Provide useful, actionable user-facing messages without exposing raw technical backend errors blindly. Do not display stack traces, internal details, or unreviewed server text directly to users.
- Preserve relevant diagnostic context, such as HTTP status, for appropriate application handling. Do not silently swallow failures.
- Handle expected failures explicitly in the UI. When using `mutateAsync`, avoid empty `catch` blocks; make the control flow clear while ensuring the user can see an appropriate error.
- Do not assume the backend always returns `ApiErrorResponse` or any other unconfirmed shape.
- Use `mocks/handlers/index.ts` for local API simulation consistent with the currently defined service contracts.

## Styling and design consistency

- Treat the Banani design reference and existing Credence styling as the visual source of truth. Use the existing Tailwind setup; do not add another styling framework or theme system.
- Prefer existing utility patterns and shared design tokens where available. Consolidate repeated values only when the token is stable and has clear reuse.
- Avoid scattering new arbitrary values when an existing utility or established token expresses the design.
- Keep layouts responsive and preserve semantic HTML, visible focus states, and reduced-motion behavior established in `index.css`.
- Validate visual changes against the design reference at relevant viewport sizes.
