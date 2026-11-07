# EventHub Frontend Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Finish the approved visual refinement, provide accessible animated feedback for completed actions, and make participant event registration use the existing API so its confirmation is truthful.

**Architecture:** Add a shared toast context and viewport at the app root, using the installed Framer Motion. Keep existing design tokens and route/role behavior. Add a small participant event API client over existing endpoints; the backend remains authoritative for registration, capacity and cancellation.

**Tech Stack:** React 19, React Router 7, Tailwind CSS 4, Framer Motion, lucide-react, existing Axios client.

**Spec:** `docs/superpowers/specs/2026-11-07-frontend-refinement-design.md`

## Global Constraints

- Keep the existing EventHub palette (`#222923`, `#A95036`, `#FFFEFA`, `#F3F1EB`, `#6B736D`) and Fraunces / DM Sans pairing.
- Do not add a dependency; Framer Motion is already installed.
- Do not change backend code, authorization policy, or the admin redirect target/role rules.
- Hide the visible BO link; retain automatic redirect after a successful BO login and announce it with: « Vous serez redirigés vers la bonne adresse pour vous connecter. »
- Keep notification copy in French, role-appropriate, accessible, and concise.
- Do not show success for placeholder controls in Profil or Invitations that do not persist an action.
- Do not change routes or the logout confirmation behavior.
- Do not add or run automated tests unless requested; verify with lint/build and manual browser paths.

## Review Focus

- Authentication to an external Filament origin: show transfer feedback, preserve the exact configured destination, and avoid persisting an API token for BO roles.
- Event list/detail when API data is loading, empty, unavailable, or an event has no cover image: provide honest loading/error/empty states and retain image fallback.
- Repeated registration/cancellation or a full event: reflect the API error without showing success or locally desynchronizing capacity/ticket state.
- Rapid successive scans: each scan status remains immediately distinguishable and does not block the next scan.
- Reduced-motion and keyboard/screen-reader use: notifications remain readable and dismissible without animation dependence.

---

### Task 1: Shared animated notification system

**Files:**
- Create: `frontend/src/contexts/ToastContext.jsx`
- Create: `frontend/src/components/ui/ToastViewport.jsx`
- Modify: `frontend/src/App.jsx`
- Modify: `frontend/src/index.css`

**Interfaces:**
- `ToastProvider({ children })` owns the queue and renders the viewport above route content.
- `useToast()` returns `{ notify({ title, description, tone, duration }), dismiss(id) }`; `tone` is `success | info | error`.
- Viewport uses a bounded stack, manual dismiss buttons, appropriate `role="status"` or `role="alert"`, and live-region politeness matching severity.

- [x] **Step 1: Add the provider and viewport**
  Implement stable toast IDs, a maximum of three visible items, default duration 4500 ms, and cleanup of each timeout on dismissal/unmount. Use short Framer Motion enter/exit transitions and `useReducedMotion`.
- [x] **Step 2: Style the liquid-glass treatment**
  Add localized toast styles using translucent ivory, controlled backdrop blur, clear border, readable ink text and semantic tone marks. Provide visible focus, sufficient contrast and a reduced-motion CSS fallback.
- [x] **Step 3: Mount once above routes**
  Wrap `AppRoutes` with `ToastProvider` in `App.jsx`, ensuring notifications persist during React route changes.
- [ ] **Step 4: Inspect provider lifecycle and accessibility**
  Manually verify simultaneous messages, dismiss, timeout cleanup, keyboard focus, live announcement semantics, narrow viewport layout and reduced-motion rendering.

### Task 2: Participant event API and truthful registration feedback

**Files:**
- Create: `frontend/src/api/EventApi.js`
- Modify: `frontend/src/pages/user/EventsList.jsx`
- Modify: `frontend/src/pages/user/EventDetails.jsx`
- Modify: `frontend/src/pages/user/Tickets.jsx`
- Modify: `frontend/src/pages/user/TicketDetail.jsx`

**Interfaces:**
- `getEvents() -> Promise<Event[]>` calls `GET /events`.
- `getEvent(id) -> Promise<Event>` calls `GET /events/{id}`.
- `getMyTickets() -> Promise<Ticket[]>` calls `GET /tickets`.
- `registerForEvent(eventId) -> Promise<Ticket>` calls `POST /events/{eventId}/tickets`.
- `cancelTicket(ticketId) -> Promise<void>` calls `DELETE /tickets/{ticketId}`.
- Use the existing `axiosClient`; do not duplicate token handling.

- [x] **Step 1: Add the API wrapper**
  Define the four methods above and return response data without remapping backend field names. Keep server errors available to the caller for clear messages.
- [x] **Step 2: Load real published events and current participation**
  Replace mock event and ticket data in list/detail/ticket screens with API data, using explicit loading, empty, and retryable error states. Preserve `ImageWithFallback` and omit its image when the API has no cover.
- [x] **Step 3: Wire participation controls**
  Make « Participer » call `registerForEvent`; show success only after API success, update displayed local event count/ticket status from the response, disable while pending, and map duplicate/full/network errors to concise French notifications. Add a cancellation action to the participant ticket detail with a confirmation dialog; call `cancelTicket` only after confirmation, then refresh ticket/event state.
- [ ] **Step 4: Verify event paths manually**
  With the API available, exercise list/detail load, successful registration, duplicate registration, full event, confirmed cancellation, and unavailable API. Confirm no success toast is emitted for failed requests and no participant list is exposed.

### Task 3: Auth, contact and scan notifications

**Files:**
- Modify: `frontend/src/pages/Login.jsx`
- Modify: `frontend/src/pages/Register.jsx`
- Modify: `frontend/src/pages/Contact.jsx`
- Modify: `frontend/src/pages/scan-agent/Scanner.jsx`

- [x] **Step 1: Refine login handoff**
  Remove the visible « Accéder au back-office » paragraph and its now-unused import. Preserve `result.backofficeLoginUrl` routing and configured target. Before `window.location.assign`, show the approved transfer message for a brief, perceptible transition; keep the same destination and role condition. Show participant/ScanAgent success only on successful login.
- [x] **Step 2: Add registration and contact feedback**
  Notify only after successful account creation or support request persistence. Keep inline field validation and transport errors; avoid repeating the same error as both inline text and toast. Use useful error toasts for failures without field-level messages.
- [x] **Step 3: Notify scan outcomes**
  Replace or supplement the large scan overlay with compact top-level notifications for valid, duplicate/used, and invalid scan results while keeping the existing result detail and immediate scan workflow understandable. Use success, warning/info, and error tone respectively.
- [ ] **Step 4: Verify auth/contact/scan flows manually**
  Check invalid credentials, successful participant login, BO redirect message and destination, account registration failure/success, support success/failure/rate limit, and all three simulated scan statuses.

### Task 4: Contact polish and project signature

**Files:**
- Create: `frontend/src/components/ui/BrandFooter.jsx`
- Modify: `frontend/src/pages/Contact.jsx`
- Modify: `frontend/src/pages/Login.jsx`
- Modify: `frontend/src/pages/Register.jsx`
- Modify: `frontend/src/layouts/UserLayout.jsx`
- Modify: `frontend/src/layouts/ScanAgentLayout.jsx`

- [x] **Step 1: Fix Contact header geometry and icon**
  Put Logo and return link into separate responsive rows/regions with deliberate gap; use Lucide `Mail` for the « Nous contacter » choice and retain a distinct problem-report icon.
- [x] **Step 2: Add a shared signature**
  Render `© {currentYear} Alecdev-10 · EventHub` unobtrusively on public auth/contact views and in both authenticated shells; use the current year dynamically.
- [ ] **Step 3: Check responsive layout**
  Inspect `/contact`, `/login`, `/register`, participant shell and ScanAgent shell at narrow and desktop widths; ensure footer does not overlap or consume essential viewport space.

### Task 5: Whole-application verification and review

**Files:**
- No planned source changes; adjust the owning task if review finds a defect.

- [x] **Step 1: Run lint**
  Run: `npm run lint`
  Expected: exits successfully without new warnings/errors.
- [x] **Step 2: Run production build**
  Run: `npm run build`
  Expected: Vite completes successfully.
- [ ] **Step 3: Manual browser review**
  Verify each path listed in Tasks 1–4, mobile and desktop contact/header/footer, keyboard-only toast dismissal, reduced-motion behavior, and BO redirect target. Confirm no visible BO link remains on Login.
- [x] **Step 4: Review the diff**
  Ensure only approved frontend files and this design/plan documentation changed; preserve pre-existing worktree changes and do not push.
