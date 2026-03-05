# Catsy Coffee Web — UI Design Guide

> Extracted from the live `catsy-coffee-web` codebase.
> Use this as the visual reference when rebuilding the skeleton project.
> Do NOT deviate from these patterns unless explicitly instructed.

---

## 🎨 Design System

### Fonts
| Role | Font | Weight | Usage |
|---|---|---|---|
| Brand / Display | `Potta One` (Google Fonts) | 400 | Logo, hero branding |
| Body / UI | `Poppins` (Google Fonts) | 400, 600 | All text, labels, buttons |

```css
@import url('https://fonts.googleapis.com/css2?family=Potta+One&family=Poppins:wght@400;600&display=swap');
--font-catsy: 'Potta One';
--font-coffee: 'Poppins', sans-serif;
```

---

### Color Tokens
| Token | Value | Usage |
|---|---|---|
| `--color-primary` | `#ffffff` | Background, card surfaces |
| `--color-accent` / `--brand-accent` | `#111111` (near black) | CTA buttons, active states, stamp fills |
| `--color-secondary` | `#888888` | Muted text, labels |
| `bg-neutral-900` | `#171717` | Dark backgrounds (nav, footer, cards) |
| `text-neutral-900` | `#171717` | Primary text |
| `text-neutral-500` | `#737373` | Secondary/subtitle text |
| `text-neutral-400` | `#a3a3a3` | Placeholder, disabled text |
| `border-neutral-100` | `#f5f5f5` | Card borders, dividers |
| `bg-green-100` / `text-green-700` | — | Active/success badges |
| `bg-red-100` / `text-red-700` | — | Error/cancelled badges |
| `bg-blue-100` / `text-blue-700` | — | Completed badges |

> The overall theme is **white + near-black** with `#111111` as the brand accent. There are no vivid colors — muted neutrals dominate.

---

### Global Body Styles
```css
body {
  background: neutral-900; /* dark by default — pages override to white */
  color: white;
  font-family: Poppins;
  overflow-x: hidden;
}
/* Hidden scrollbar for cinematic feel */
::-webkit-scrollbar { width: 0px; }
```

---

## 🧩 Reusable UI Patterns

### Input Fields
All inputs use **pill / rounded-full** style with no border — focus ring replaces border:

```jsx
<div className="flex items-center bg-white p-4 rounded-full border border-neutral-100 focus-within:ring-2 focus-within:ring-brand-accent transition-shadow">
  <User size={20} className="text-neutral-400 mr-3 shrink-0" />
  <input className="w-full bg-transparent outline-none font-bold text-neutral-900 placeholder:font-normal" />
</div>
```

- Padding: `p-4`
- Shape: `rounded-full`
- Background: `bg-white`
- Focus: `focus-within:ring-2 focus-within:ring-brand-accent`
- Icon: Lucide React, 20px, `text-neutral-400`
- Label above: `text-xs font-bold uppercase text-neutral-400 tracking-wider ml-4`

---

### Buttons

**Primary (Dark):**
```jsx
<button className="w-full bg-neutral-900 text-white py-4 rounded-full font-bold text-lg shadow-xl hover:scale-105 duration-500 active:scale-95 transition-all">
  Button Text
</button>
```

**Secondary (Outlined):**
```jsx
<button className="w-full bg-transparent border-2 border-neutral-900 text-neutral-900 py-4 rounded-full font-bold text-lg hover:bg-neutral-50 transition-colors duration-300">
  Reserve a Table
</button>
```

**Disabled state:**
```jsx
className="bg-neutral-200 text-neutral-400 cursor-not-allowed"
```

**Pill small (e.g. badge-style button):**
```jsx
<button className="text-sm font-bold bg-neutral-100 hover:bg-neutral-200 text-neutral-900 px-4 py-2 rounded-full transition-colors">
  Edit
</button>
```

---

### Cards
```jsx
// Standard white card
<div className="bg-white rounded-3xl border border-neutral-100 overflow-hidden p-5">
```
```jsx
// Dark card (loyalty, featured)
<div className="bg-neutral-900 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
```

Shape: always `rounded-3xl`

---

### Status Badges
```jsx
// Open/Closed (hero)
<div className="w-2 h-2 rounded-full animate-pulse bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.8)]" />
<span className="text-sm font-bold tracking-widest uppercase text-green-600">Open Now</span>

// Reservation status
"pending"   → yellow-100 / yellow-700
"confirmed" → green-100  / green-700
"completed" → blue-100   / blue-700
"cancelled" → red-100    / red-700

<span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wide">
  confirmed
</span>
```

---

### Modals / Bottom Sheets
```jsx
// Overlay
<div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6 animate-fade-in">
  // Content — slides up from bottom on mobile, centered on desktop
  <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-slide-up-fade">
```

---

### Toast Notifications
Uses `<CustomerToast>` component with variants:
- `type="success"` — green check
- `type="error"` — red alert

Props: `isOpen`, `onClose`, `title`, `message`, `confirmLabel` (optional)

---

### Loading Skeleton
```jsx
// Pulse placeholder for any text/card while loading
<div className="h-9 w-48 bg-neutral-200 rounded-xl animate-pulse" />
<div className="w-full aspect-square rounded-full bg-white/10 animate-pulse" />
```

---

### Navigation Animation (`.nav-link-animated`)
```css
.nav-link-animated::before {
  content: '';
  position: absolute; bottom: 0; left: 0;
  width: 100%; height: 3px;
  background: white;
  transform: scaleX(0);
  transition: transform 300ms ease-out;
  transform-origin: right;
}
.nav-link-animated:hover::before { transform: scaleX(1); transform-origin: left; }
```

---

## 📄 Page-by-Page Design Reference

---

### 1. Home Page

**Structure (top to bottom):**
1. `HeroSection` — full viewport height, white background
2. `SignatureThree` — floating spotlight cards
3. `UnifiedMenu` — minimalist product list
4. `LiveFloorMap` — table/location section
5. Footer — dark, centered copyright text

**Footer:**
```jsx
<div className="py-20 bg-neutral-900 border-t border-white/5 text-center">
  <p className="text-neutral-500 text-xs tracking-[0.5em] uppercase">
    © 2026 Catsy Coffee • Brewed with Passion
  </p>
</div>
```

---

### 1a. Hero Section

**Layout:** Full screen (`height: 100svh`), white bg, flex column, centered content

**Splash animation (first load only):**
- Catsy SVG logo draws itself (`CatsyLogo` component — GSAP DrawSVG)
- Logo starts large (320×320, centered full screen)
- On animation complete: GSAP Flip transitions logo to small hero position (top of content)
- Text words reveal one by one (staggered `opacity + y`)
- Two decorative coffee cups appear with `back.out` bounce pop
- Scroll indicator fades in at bottom

**Elements:**
- Catsy logo (SVG animated) — `w-45 h-45` after transition
- Headline: `text-2xl md:text-4xl font-sans font-bold text-neutral-900`
- Subline: `text-neutral-500 text-base md:text-lg`
- Primary CTA: dark pill button — text changes: `Login` if guest, `Profile` if logged in
- Secondary CTA: outlined pill — `Reserve a Table`
- Open/Closed badge with glowing green/red dot
- Scroll indicator: small dot + vertical line, bounces, text: `"SCROLL"`

**Decorative cups:**
```jsx
// Left cup - positioned off-screen left
<img className="absolute top-[100px] -left-[80px] w-[200px] cup-atmospheric"
     style={{ transform: 'rotate(35deg)' }} />
// Right cup - off-screen right
<img className="absolute top-[230px] -right-[80px] w-[200px] cup-atmospheric"
     style={{ transform: 'rotate(-50deg)' }} />
```
```css
.cup-atmospheric {
  backdrop-filter: blur(2.4px);
  mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%);
  object-fit: contain;
}
```

---

### 2. Login / Sign Up Page

**Layout:** `min-h-screen`, vertically centered, `px-6`, white background, `max-w-sm` content container

**Sections:**
1. Header text (toggles with form type)
   - Login: `"Welcome Back."` / `"Sign in to your private portal."`
   - Signup: `"Join Catsy."` / `"Start your coffee journey today."`
2. Form fields (described in global patterns above)
3. Submit button (`MagneticButton`) — dark pill, full width
4. Toggle link: `"Don't have an account? Sign Up"`
5. Forgot Password link (login mode only)

**Fields for Login:** Email/Username, Password (with eye toggle)

**Fields for Sign Up (additional):** First Name + Last Name (2-column grid), Email, Password, Confirm Password

**Password Strength Bar (Signup only):**
```jsx
<div className="h-1 w-full bg-neutral-100 rounded-full overflow-hidden">
  <div className="h-full transition-all duration-500 bg-green-500"
       style={{ width: `${(score / 5) * 100}%` }} />
</div>
// + 2-column checklist grid below bar (dot indicator per requirement)
```

**MagneticButton:** Wraps the submit button — adds magnetic hover physics effect

**Error/Success:** Shown via `<CustomerToast>` modal overlay

---

### 3. Profile Page

**Layout:** `min-h-screen pt-24 px-6 pb-32 animate-fade-in`

**Sections:**
1. Header: `"My Profile"` + `Edit` pill button (right)
2. `<IdentityHub>` — QR code component for the user
3. Favorites chip (horizontal scroll, pill shape, white bg, black text, shadow)
4. Profile fields (vertical stack) — read mode: `border-b border-neutral-200`, edit mode: `border-b-2 border-brand-accent`
5. Password field with strength bar (same as Login)
6. Save/Cancel buttons (side by side, `rounded-full`, when editing)
7. Transaction History (past orders in `rounded-3xl` white card, clickable rows)
8. Reservation History (table list with status badge)
9. Review Modal (bottom sheet, star ratings for Drinks / Service / Place)

**Field labels:** `text-xs font-bold uppercase text-neutral-400 tracking-wider`

**Field values (read):** `text-xl font-bold text-neutral-900 border-b border-neutral-200 pb-2`

**Field values (edit):** `text-xl font-bold border-b-2 border-brand-accent pb-1 outline-none bg-transparent`

---

### 4. Reservation Page

**Layout:** `min-h-screen pt-24 px-6 pb-32 animate-fade-in`

**States:**
- **Form state** (no active booking): shows booking form
- **Status state** (active booking): hides form, shows reservation card

**Form sections:**
1. Page title + table availability badge (`X Tables Available`)
2. Date/time + Guests dropdown
3. Personal info: Name, Phone, Email (auto-filled if logged in → read-only)
4. Special Requests textarea
5. Closed banner: shown when `is_open = false`
6. Confirmation modal before submit

**Status card:**
- Reservation details (name, date, guests, special requests)
- Large status badge (color-coded, see Status Badges above)
- Live updates via SSE

---

### 5. Loyalty Page

**Layout:** `min-h-screen pt-24 px-6 pb-32 animate-fade-in`

**Guard states** (full-screen fallback):
- Not logged in → Coffee icon + "Log in to see your stamps"
- Loading → Full skeleton (pulse animations for card + rewards list)
- Error → Alert triangle + error message

**Main sections:**

**Stamp Card** (dark, `bg-neutral-900 rounded-3xl shadow-xl`):
```
Header row: "Catsy Cafe Card"   X/9
3×3 grid of stamp circles
Progress text: "X more stamps to unlock a free drink"
```

**Stamp circles:**
- Stamped: `bg-brand-accent shadow-[0_0_12px_rgba(17,17,17,0.5)]` + white inner circle with Catsy SVG logo
- Unstamped: `bg-white/10` + nearly transparent logo (`opacity-5`)
- Animated on load: `scale: 0 → 1, rotation: -45 → 0, elastic.out(1, 0.5)` stagger

**Claim button** (only when `unspentCount >= 9`):
```jsx
<button className="w-full mb-8 bg-neutral-900 text-white font-bold h-16 rounded-2xl flex items-center justify-center shadow-xl">
  <Gift size={20} /> Claim Free Drink
</button>
```

**Your Stash section:**
- Each reward: white `rounded-3xl` card, left = drink name + code (green for active), right = status badge + "View QR" button
- Empty state: dashed border card `border-2 border-dashed border-neutral-200`

**Modals:**
- Claim modal: bottom sheet, drink selector list, confirm button
- QR overlay: centered, white card, QR image from `api.qrserver.com`, mono coupon code

---

### 6. Admin Panel

**Layout:** Protected — only `admin` / `staff` role can access

**Admin Login page:**
- Same visual design as customer login
- Separate route: `/admin/login`

**Admin Dashboard:**
- Open/Close toggle
- Stats cards (orders, revenue)
- Recent reservations table

**Admin Reservation Management:**
- Full table with filter tabs
- Action buttons per row: Confirm / Reject / Complete
- Real-time via SSE

---

## 🎬 Animation Summary

| Animation | Library | Trigger | Details |
|---|---|---|---|
| Logo SVG draw | GSAP DrawSVG | First page load | Draws Catsy logo stroke by stroke |
| Logo Flip transition | GSAP Flip | After draw complete | Logo moves from center → hero top-left, `duration: 1.5, power4.inOut` |
| Text reveal | GSAP timeline | After Flip | Words stagger opacity + y, `duration: 1.8, power4.out` |
| Cup pop | GSAP | After text | Both cups scale 0→1 with `back.out(1.7)` |
| Page enter | CSS | Route change | `animate-fade-in` class |
| Stamp reveal | GSAP | Loyalty page mount | `scale: 0 → 1, rotation: -45 → 0, elastic.out(1, 0.5), stagger: 0.07` |
| Modal slide | CSS | On open | `animate-slide-up-fade` |
| Skeleton loader | CSS | While fetching | `animate-pulse` on placeholder divs |
| Scroll lock | JS | During splash | `document.body.style.overflow = 'hidden'` until hero reveal complete |

---

## 📦 Key Dependencies

| Package | Purpose |
|---|---|
| `gsap` + `@gsap/react` | All page animations and transitions |
| `lucide-react` | All icons (User, Lock, Gift, Star, etc.) |
| TailwindCSS v4 | Utility classes + `@theme` tokens |
| `react` | UI framework |

---

## 🔑 Page Layout Template

All pages (except Hero) share this wrapper:
```jsx
<div className="min-h-screen pt-24 px-6 animate-fade-in pb-32">
  <h1 className="text-4xl font-sans font-bold text-neutral-900 mb-8">
    Page Title
  </h1>
  {/* content */}
</div>
```

- `pt-24` — clears the fixed navbar
- `pb-32` — bottom padding for mobile nav clearance
- `animate-fade-in` — page enter animation
