# Task 6+7: Dark Mode for CartView, CheckoutView, AuthView

## Summary
Added comprehensive dark mode Tailwind variants to three e-commerce components without changing any logic or removing features.

## Files Modified
1. **src/components/shop/cart-view.tsx** - 19 dark mode additions covering empty state, cart items, order summary, coupon section, mobile sticky bottom
2. **src/components/shop/checkout-view.tsx** - 23 dark mode additions covering step indicators, address form, payment options, order review, security badge
3. **src/components/shop/auth-view.tsx** - 15 dark mode additions covering form card, inputs, labels, quick login buttons, divider, toggle text

## Dark Mode Color Palette
- **Backgrounds**: `dark:bg-slate-800/60` (cards), `dark:bg-slate-900/95` (sticky bars), `dark:bg-slate-900` (form card)
- **Borders**: `dark:border-slate-700/40` (cards), `dark:border-slate-700` (inputs/dividers), `dark:border-slate-600/80` (input borders)
- **Text**: `dark:text-slate-200` (primary text), `dark:text-slate-300` (labels), `dark:text-slate-400` (secondary), `dark:text-slate-500` (muted)
- **Accents**: `dark:text-emerald-400` (savings), `dark:bg-emerald-950/80` (discount badges), `dark:text-blue-400` (hover links)
- **Interactive**: `dark:hover:text-red-400`, `dark:hover:bg-red-950/30` (remove), `dark:hover:text-slate-200` (continue shopping)

## Verification
- ESLint: All three files pass with zero errors
- No logic changes - only `dark:` Tailwind variants added
- All existing functionality preserved
