# Next Release (v1.1.0) — Gameplay & UX Polish

Planned improvements for the next update after the initial Play Store release:

- **Auto-pause on app background (`src/components/Game.tsx`):**
  Listen to React Native `AppState` changes and automatically set `isPause(true)` when the app moves to `"background"` or `"inactive"` so the snake doesn't keep moving if the user switches apps or receives a phone call.

- **Self-collision detection (`src/utils/checkGameOver.ts`):**
  Check whether `newHead` collides with any segment of the snake's body (excluding the tail tip when not growing) in addition to the wall boundary check.

- **Prevent 180° instant reversal (`src/components/Game.tsx`):**
  Ignore pan gestures that attempt to reverse directly into the opposite direction (e.g., `RIGHT` → `LEFT` or `UP` → `DOWN`) in a single swipe.

