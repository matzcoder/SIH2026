---
trigger: always_on
description: "Enforce warm terracotta & rust design system and forbid #FFFFFF / cool neutrals in sih-project."
---

# Dashboard Redesign Guard (Warm Terracotta & Rust)

Whenever editing or generating code in `sih-project`:

## 1. Palette Rules (Strict)
- **NO `#FFFFFF` or pure white surfaces**: All surfaces, cards, modals, and dropdowns MUST use warm-toned backgrounds:
  - Page Background: `bg-base` (`#FBF3EC`)
  - Cards & Panels: `bg-surface` (`#F5E6D8`)
  - Modals & Raised Dropdowns: `bg-surface-raised` (`#FFF9F2`)
- **NO cool-toned neutrals**: Never use Tailwind `slate-*`, `gray-*`, `zinc-*`, or hexes like `#0f172a`, `#64748b`, `#e2e8f0`.
  - Headings & Primary text: `text-primary` (`#3B2A22`)
  - Muted / Secondary text: `text-secondary` (`#7A5C48`)
  - Borders & Dividers: `border` (`#E4CBB4`)
- **Primary Actions & Nav**:
  - Primary button: `primary` (`#C1502D`) with off-white text (`#FFF9F2`), hover `primary-hover` (`#A63F22`)
  - Active nav item: Terracotta background (`#C1502D`), rust left border accent (`#B7410E`), warm off-white text (`#FFF9F2`)
  - Accent highlights: `accent` (`#B7410E`)
  - Success badge / status: `success` (`#7A8450`)
  - Warning badge / status: `warning` (`#D98E04`)
  - Error badge / status: `error` (`#A63A32`)
  - Info badge / status: `info` (`#8A6D57`)
- **Warm Shadows**: Always use warm-toned shadows (`rgba(139, 69, 19, ...)`), never cool black or slate.

## 2. Recheck Command
Always verify changes by executing:
```bash
python scripts/recheck_and_correct.py --check
```
If any infractions are detected, remediate them immediately using:
```bash
python scripts/recheck_and_correct.py --fix
```
