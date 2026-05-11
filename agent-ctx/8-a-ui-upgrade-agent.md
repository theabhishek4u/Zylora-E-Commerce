---
Task ID: 8-a
Agent: UI Upgrade Agent
Task: Upgrade page.tsx with AnimatePresence transitions and orders-view.tsx with premium visuals

Work Log:
- Read worklog.md to understand prior context (mobile responsiveness was done in task 1)
- Read current page.tsx and orders-view.tsx
- Updated page.tsx:
  - Imported `motion` and `AnimatePresence` from framer-motion
  - Created `viewVariants` with fade + slide (initial: opacity 0 y 12, animate: opacity 1 y 0, exit: opacity 0 y -8)
  - Set `viewTransition` with tween ease and 0.25s duration
  - Wrapped `renderView()` in `AnimatePresence mode="wait"` with `motion.div key={currentView}`
  - Preserved all existing layout structure (Header, main, Footer, MobileBottomNav)
- Updated orders-view.tsx:
  - Replaced simple STATUS_COLORS with rich STATUS_CONFIG object containing gradient, bg, text, border, badge classes per status
  - Header: Added gradient Package icon in a blue-to-cyan gradient rounded container
  - Search card: Premium glassmorphism (bg-white/70 backdrop-blur-xl), gradient top accent line, input with focus glow ring, gradient search button with shadow
  - Empty state: Large gradient-styled Package icon with animated bounce (motion y oscillation), better typography with helper text, gradient hover on Continue Shopping button
  - Order cards: Gradient top border matching status, glassmorphic card background, vertical dividers between order info columns, gradient total amount, gradient status badges with white text, larger product thumbnails, item count subtitle, "View Details" button with gradient hover effect
  - Status color mapping: confirmed=blue-cyan, processing=indigo-violet, shipped=purple-fuchsia, delivered=emerald-teal, cancelled=red-rose, pending=slate
  - Added staggered animation delay on order cards (index * 0.06s)
  - All existing imports, logic, store connections preserved
- Lint passes cleanly
- Dev server running successfully, all routes compiling

Stage Summary:
- Page transitions now smooth with AnimatePresence fade+slide between views
- Orders view upgraded to premium glassmorphic design with gradient accents
- Status badges use gradient backgrounds instead of flat colors
- Order cards have gradient top borders matching their status
