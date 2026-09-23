# Dashboard Frontend Redesign — Spec for Stitch + Antigravity

## Overview
- **Project:** [Your dashboard name] — frontend redesign
- **Goal:** Recreate the current dashboard UI using Google Stitch to generate the new screens, then implement them in the existing React/Next.js codebase using Google Antigravity.
- **Core direction:** Replace the neutral/white UI with a warm, terracotta-and-rust palette. No pure white surfaces anywhere in the product.
- **Stack:** React + Next.js (App Router assumed — adjust if you're on the Pages Router)

> This spec assumes a standard dashboard layout (sidebar + topbar + content area). Swap in your actual page list and components under **Section 3: Page Inventory** before handing this to Stitch or Antigravity.

---

## 1. Design System

### 1.1 Color Palette
No pure white (`#FFFFFF`) or cool gray anywhere. All neutrals are warm-toned — cream, sand, and espresso instead.

**Light theme (default)**

| Token | Hex | Use |
|---|---|---|
| `bg-base` | `#FBF3EC` | Page background (warm cream, not white) |
| `bg-surface` | `#F5E6D8` | Cards, panels, sidebar |
| `bg-surface-raised` | `#FFF9F2` | Modals, dropdowns (still warm, never stark white) |
| `border` | `#E4CBB4` | Dividers, input borders |
| `text-primary` | `#3B2A22` | Headings, body text |
| `text-secondary` | `#7A5C48` | Muted / help text |
| `primary` | `#C1502D` | Terracotta — primary buttons, active states |
| `primary-hover` | `#A63F22` | Rust — hover / pressed |
| `accent` | `#B7410E` | Rust — highlights, active nav, links |
| `success` | `#7A8450` | Sage / olive (warm-compatible green) |
| `warning` | `#D98E04` | Amber |
| `error` | `#A63A32` | Brick red |
| `info` | `#8A6D57` | Warm taupe (used instead of blue) |

**Dark theme (optional)**

| Token | Hex | Use |
|---|---|---|
| `bg-base` | `#1F1512` | Page background |
| `bg-surface` | `#2A1F1A` | Cards, panels |
| `text-primary` | `#F5E9DD` | Body text |
| `primary` | `#E2725B` | Buttons, active states |
| `accent` | `#D9773F` | Highlights |

### 1.2 Typography
- **UI / body:** Inter or General Sans — keeps a warm palette from tipping into "rustic"
- **Headings:** Fraunces or Lora — a warm serif for page titles / empty states, used sparingly
- **Scale:** 12 / 14 / 16 / 20 / 24 / 32 px, 1.5 line height for body text

### 1.3 Shape & Elevation
- **Radius:** 10px cards, 8px buttons/inputs, 999px pills & badges
- **Shadows:** warm-toned, never cool gray — e.g. `0 2px 8px rgba(139, 69, 19, 0.12)`
- **Spacing scale:** 4 / 8 / 12 / 16 / 24 / 32 / 48 px

---

## 2. Layout

- **Sidebar** (fixed, collapsible): logo, nav items — active item gets a terracotta background + rust left-border accent
- **Topbar**: search, notifications, profile menu — `bg-surface`, bottom border in `border` token
- **Main content**: page title + breadcrumb, action buttons top-right, content grid below
- **Content patterns**: stat cards, charts, data tables, forms, empty states, toasts

---

## 3. Page Inventory (customize this list to match your actual site)
- [ ] Overview / Home — stat cards + summary chart
- [ ] [Your resource] list view — data table with filters
- [ ] [Your resource] detail view
- [ ] Settings
- [ ] Auth (login / signup) — keep the warm palette here too, don't let this fall back to a plain white screen

---

## 4. Component Specs

**Buttons**
- Primary: `primary` fill, warm off-white text (`#FFF9F2`, not pure white), `primary-hover` on hover
- Secondary: transparent fill, `accent` border + text
- Ghost: text-only, `text-secondary`, hover → `bg-surface`

**Cards**
- `bg-surface`, 1px `border`, 10px radius, warm shadow

**Data tables**
- Header row: `bg-surface-raised`, `text-secondary`, small uppercase labels
- Row striping: alternate `bg-base` / `bg-surface` (never gray)
- Row hover: light terracotta tint — `rgba(193, 80, 45, 0.06)`

**Charts**
- Categorical palette (avoid default blues): `#C1502D, #D98E04, #7A8450, #8A6D57, #E2725B, #B7410E`
- Gridlines: `border` token at low opacity

**Forms**
- Input border: `border` token; focus ring: 2px `accent`
- Labels: `text-secondary`

**Badges / status pills**
- Success / warning / error / info map to the palette tokens above — pill radius, ~20% opacity background with full-opacity text

---

## 5. Accessibility
- Verify all text/background pairs meet WCAG AA (4.5:1 for body text, 3:1 for large text)
- `text-primary` (#3B2A22) on `bg-base` (#FBF3EC) ≈ 10:1 — passes comfortably
- On `primary` (#C1502D) buttons, use `#FFF9F2` text rather than dark text, to keep contrast
- Don't rely on color alone for status — pair with an icon or label

---

## 6. Workflow: Stitch → Antigravity

1. **Generate screens in Stitch.** Use the prompt below (once per page from your Page Inventory) to get first-pass UI screens.
2. **Export** the Stitch output and drop it into your Antigravity project as a design reference.
3. **In Antigravity**, point the agent at the existing Next.js codebase plus this spec file, and ask it to:
   - Rebuild each page/component to match the Stitch screens
   - Replace all existing color tokens with the palette in Section 1.1
   - Confirm no `#FFFFFF` or Tailwind `white` / `gray-*` classes remain in the diff
4. **QA pass:** check every screen against the checklist in Section 7.

### Sample Stitch prompt
> "Design a [page name] screen for a web app dashboard. Warm color palette — terracotta (#C1502D) and rust (#B7410E) as primary/accent, cream (#FBF3EC) background, no white or gray. Sidebar navigation, clean sans-serif type, soft rounded cards with warm-toned shadows. [Add page-specific content: stat cards / data table / form fields, etc.]"

---

## 7. Do / Don't Checklist
- ✅ Cream/sand backgrounds everywhere a white background would normally go
- ✅ Terracotta/rust for all primary actions and active states
- ✅ Warm-toned shadows and borders
- ❌ No `#FFFFFF` surfaces
- ❌ No default Tailwind `gray-*` / `slate-*` neutrals
- ❌ No cool-toned blues for links/info states — use the warm `info` token instead
