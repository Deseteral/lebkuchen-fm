# SolidJS SPA Audit - LebkuchenFM Client

## Scope
Audited `/client` with focus on:
- SolidJS reactivity correctness
- SPA architecture quality
- Performance/runtime efficiency
- Maintainability/scalability
- Security
- Retro UX authenticity
- Testing/reliability
- Production readiness

Accessibility was deprioritized except for catastrophic usability concerns.

---

## Critical Findings

### 1) Closed apps are still mounted and running side effects
**Where**
- `client/src/apps/ApplicationHost.tsx`
- `client/src/apps/Users/Users.tsx`
- `client/src/apps/Soundboard/Soundboard.tsx`

**Why it matters**
All app components mount at startup; window "close" only hides UI. Effects/fetches still run in background, creating hidden work, network churn, and state complexity.

**Fix**
- Conditionally mount apps by open-state (`ApplicationServer.isOpen(id)`), not just window visibility.
- Introduce lazy loading per app with `lazy()` + `Suspense`.

---

### 2) No runtime automated tests
**Where**
- No `*.test.*`/`*.spec.*` in client
- `client/package.json` `test` is static checks only

**Why it matters**
High-risk flows (auth redirect, reconnect logic, player sync, window lifecycle) have no runtime safety net.

**Fix**
- Add unit tests for core services (`api-fetch`, socket client, users/integration services).
- Add integration tests for login/401 behavior and key app lifecycles.

---

### 3) No root crash containment
**Where**
- `client/src/main.tsx`

**Why it matters**
Unhandled exceptions can crash the full SPA with no recovery UI.

**Fix**
- Wrap app root in Solid `ErrorBoundary` with fallback + centralized error reporting.

---

## High Findings

### 4) WebSocket reconnect timer lifecycle bugs
**Where**
- `client/src/services/socket-connection-client.ts`

**Why it matters**
Reconnect timer is unmanaged; reconnect may occur after intentional disconnect, causing loops or duplicate behavior.

**Fix**
- Track reconnect timeout ID.
- Clear timeout on `disconnect()`.
- Add reconnect guard + backoff/jitter.

---

### 5) Timer race conditions in notifications
**Where**
- `client/src/components/MenuBar/components/NotificationPanel/NotificationPanel.tsx`
- `client/src/services/notification-service.ts`

**Why it matters**
Untracked close timers can race with reopen/clear, causing stale updates after unmount/clear.

**Fix**
- Track animation timeout IDs.
- Clear on reopen/cleanup/clear-all.

---

### 6) Inconsistent API/auth handling and weak response validation
**Where**
- `client/src/services/api-fetch.ts`
- `client/src/services/user-account-service.ts`
- `client/src/apps/Terminal/command-service.ts`
- `client/src/services/users-service.ts`
- `client/src/apps/Soundboard/services/soundboard-service.ts`

**Why it matters**
Some endpoints bypass shared 401 behavior and parse JSON without `response.ok` checks. Leads to inconsistent auth UX and fragile error handling.

**Fix**
- Route all calls through one hardened API client.
- Standardize status handling + safe JSON parsing.
- Add schema validation for critical payloads.

---

### 7) Layer boundary erosion / coupling drift
**Where**
- `client/src/services/desktop-layout-service.ts` imports from `views`
- `client/src/services/application-server.ts` imports app-layer types
- `client/src/components/MenuBar/components/VolumeWidget/VolumeWidget.tsx` imports player app service

**Why it matters**
Cross-layer dependencies increase fragility and make scaling/refactors risky.

**Fix**
- Move shared app contracts/registry into neutral domain modules.
- Enforce dependency direction rules.

---

## Medium Findings

### 8) No app-level code splitting
**Where**
- `client/src/apps/ApplicationHost.tsx`
- `client/src/main.tsx`

**Why it matters**
Large initial payload and memory cost, especially as app count grows.

**Fix**
- Lazy-load each app window and render fallback in `Suspense`.

---

### 9) Dist output hygiene risk
**Where**
- `client/dist/assets` shows many historical hashed bundles
- `client/vite.config.ts`

**Why it matters**
Potential deployment artifact bloat and cache complexity.

**Fix**
- Set `build.emptyOutDir = true` explicitly.

---

### 10) Drag implementation can trigger layout-heavy updates
**Where**
- `client/src/components/AppWindow/AppWindow.tsx`

**Why it matters**
Updating `top/left` on every mousemove may cause layout thrash.

**Fix**
- Use `transform` while dragging; commit final position on drag end.

---

### 11) Rootless module-level effect ownership
**Where**
- `client/src/services/desktop-manager.ts`

**Why it matters**
Rootless reactive effect can leak across HMR/tests and is harder to reason about.

**Fix**
- Move to explicit init/cleanup tied to Desktop lifecycle.

---

### 12) Large-list and terminal growth inefficiencies
**Where**
- `client/src/apps/Soundboard/Soundboard.tsx`
- `client/src/apps/Terminal/Terminal.tsx`

**Why it matters**
Sound filtering/sorting on every keystroke and unbounded terminal buffer degrade runtime as data/session size grows.

**Fix**
- Debounce + memoize filtering.
- Use keyed `<For>`.
- Add terminal ring-buffer cap.

---

## Security Review Highlights

### High/Medium Risks
- WebSocket payloads are trusted without strict schema/allowlist validation (`socket-connection-client.ts`).
- API response contracts are weakly validated in several services.
- Potential CSRF hardening depends on backend cookie policy (needs explicit confirmation).

### Positive Findings
- No obvious hardcoded secrets in client source.
- No `dangerouslySetInnerHTML`, `eval`, or dynamic code execution patterns found.
- Local storage usage appears limited to UI state/preferences.

---

## Retro UX Authenticity Review

### What works
- Desktop-shell metaphor, windowing, menu bar, icon sprites, terminal concept are coherent.

### Immersion breaks
- Visual language mixes retro shell with modern rounded/shadow-heavy controls:
  - `client/src/components/AppWindow/AppWindow.module.css`
  - `client/src/apps/Soundboard/Soundboard.module.css`
- Global `user-select: none` harms expected desktop interactions (`client/src/styles.css`).

### Fix direction
- Define stricter retro design tokens (border, depth, palette, interaction states).
- Scope `user-select: none` to draggable chrome only.

---

## State Management Audit

### Risks
- Singleton global services are convenient but create broad hidden coupling.
- Derived state occasionally managed by effect+signal where memo/inline derivation is better.
- Global listener/timer ownership is inconsistent in some components/services.

### Recommendations
- Tighten ownership boundaries per feature.
- Prefer derived memos over effect-driven duplication.
- Standardize cleanup patterns for listeners/timers/reconnect logic.

---

## Testing & Reliability Gaps

No unit/integration/E2E coverage found for client runtime behavior.

### Highest-value tests to add first
1. Auth flow: login success/failure and 401 redirect consistency.
2. Socket lifecycle: connect/disconnect/reconnect and session invalidation.
3. Notification timing: close/reopen/clear-all race behavior.
4. Window manager: active window/group behavior and reset/close commands.
5. Core API services: status/error/shape handling.

---

## Production Readiness Risks

- Missing root error boundary and client observability.
- Inconsistent API handling contracts.
- No runtime tests.
- Startup architecture doesn't scale cleanly due to eager mounts and global orchestration concentration in Desktop bootstrap.

---

## Scores

- **Overall architecture:** 5.3 / 10
- **SolidJS quality:** 5.8 / 10
- **Performance:** 4.9 / 10
- **Security:** 6.1 / 10
- **Maintainability:** 5.0 / 10
- **Retro UX authenticity:** 6.4 / 10
- **Production readiness:** 4.6 / 10

---

## Executive Summary

- **Biggest architectural mistake:** Eager always-mounted app host with side effects running outside actual window lifecycle.
- **Biggest performance issue:** No code splitting + hidden background work from closed windows.
- **Biggest maintainability risk:** Cross-layer coupling between services, views, components, and app-specific internals.
- **Fastest high-impact improvements:**
  1. Lazy/conditional app mounting with `Suspense`.
  2. Unified hardened API client + consistent auth handling.
  3. Root `ErrorBoundary` + telemetry.
  4. Fix reconnect/timer lifecycle ownership.
  5. Add baseline runtime tests.
- **Refactor first:** `ApplicationHost` + Desktop runtime orchestration boundaries.
