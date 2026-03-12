# Catsy Coffee — Wireframe Prompt

**Design:** Cream bg (customer) / neutral-900 dark bg (admin). Pill inputs, `rounded-3xl` cards, bold sans-serif, monospace for codes. Slide-up modals, fade-in pages, pulse skeletons. Fixed bottom nav on all customer screens (Home / Reservation / Loyalty / Profile).

---

# CUSTOMER SCREENS

# C-01 Home
1. **Hero** — Dark image bg. "Login" + "Sign Up" pills top-right. Catsy logo + "Brewed with Passion" headline center.
2. **Signature Three** — 3 dark product spotlight cards, horizontal scroll. Photo + name + price + glow.
3. **Beverage Library** (`#beverage-library`, `py-24`, white bg) — **No images.**
   - Section label: `Beverage Library` (10px, uppercase, tracking-[0.4em], muted gray)
   - Category dropdown trigger (pill button, neutral-50 bg, coffee icon + ChevronDown): shows `Select your Cup` when open, else current category name. Dropdown list: white card, `rounded-[2rem]`, each option rows with coffee icon + name. Selected = `bg-neutral-900 text-white`.
   - Product grid: 2-col mobile / 3-col desktop. Each row is **text-only** (no image): `border-b border-neutral-100`, item name (left, truncated, hover = amber-700) + price (right, monospace, muted bold). Max 12 items mobile / 18 desktop.
   - See All / Show Less pill button below grid (chevron rotates): `SEE ALL` / `SHOW LESS`.
   - Giant `MENU` watermark text centered behind grid (opacity 2%, decorative).
4. **Live Floor Map** (`#find-your-spot`) — Full-width 600px dark section (`bg-neutral-900`). Greyscale interactive Google Maps embed (hover removes greyscale). Centered pulsing brand-accent map-pin icon on top. Right-side sidebar overlay card (`bg-neutral-900/95`, `rounded-[2.5rem]`, `backdrop-blur`) slides in containing:
   - 2-col photo gallery (4 café images, aspect-[4/3], rounded-2xl, scale-on-hover)
   - Location title (`locationData.title`) — 3xl bold white
   - Real-time status line (pulsing green dot + `tablesData.shopStatus` uppercase tracked)
   - Table availability line — **3 states with exact strings:**
     - Green dot → `● {n}/{total} TABLES AVAILABLE`
     - Orange dot (pulsing) → `● ONLY 1 TABLE LEFT`
     - Red dot → `● CURRENTLY FULL - CHECK BACK SOON`
   - `Address` label (tiny uppercase, muted) + `locationData.address` text
   - Primary CTA: white pill button → `RESERVE TABLE` + ArrowUpRight icon
   - Secondary CTA: ghost pill button → `GOOGLE MAP` (opens in new tab)
   - Dismissible: X close button top-right. Reopen via LocateFixed icon when hidden.
5. **Footer** — Dark. "© 2026 Catsy Coffee" — tiny, wide tracking.

# C-02 Login / Sign Up
Centered column (max 384px), `bg-brand-primary`, fade-in.

**Header (changes by state):**
- Login: headline `"Welcome Back."` — subtitle `"Sign in to your private portal."`
- Sign-up: headline `"Join Catsy."` — subtitle `"Start your coffee journey today."`

**Sign-up only — 2-col name grid:**
- Label `FIRST NAME` / placeholder `"Jane"` | Label `LAST NAME` / placeholder `"Doe"`

**Shared fields (pill inputs, white bg, brand-accent focus ring):**
- Label `EMAIL / USERNAME` — User icon left — placeholder `"name@example.com"`
- Label `PASSWORD` — Lock icon left — Eye/EyeOff toggle right — placeholder `"• • • • • •"`

**Sign-up only — Password strength (shown while typing):**
- Progress bar color: red → yellow → green. Strength label: `"Weak"` / `"Fair"` / `"Good"` / `"Strong"`.
- 2-col checklist: green dot (met) / gray dot (unmet) per requirement.
- Label `CONFIRM PASSWORD` — placeholder `"Confirm password"`

**Submit button (full-width pill):**
- Login: `"Login"` | Sign-up: `"Create Account"` + ArrowRight icon
- Loading: `"Processing..."` — Disabled (gray) when password is weak

**Footer links:**
- Login: `"Don't have an account?"` → `"Sign Up"`; `"Forgot Password?"`
- Sign-up: `"Already have an account?"` → `"Login"`

**Toasts (CustomerToast, slide-up):**
- Login success → title `"Welcome Back!"` / msg `"Good to see you again, {firstName}."`
- Sign-up success → title `"Account Created"` / msg `"Your account has been successfully created."`
- Login error → title `"Login Failed"` / msg from API
- Sign-up error → title `"Signup Error"` / msg from API
- Staff on wrong portal → title `"Wrong Portal"` / msg `"Staff accounts must log in via the staff portal. Please visit /admin to access your dashboard."`





# C-03 Loyalty
Page title: `"My Stamp Card"` (4xl bold). Logged-out guard: Coffee icon + `"Log in to see your stamps"`.

**Stamp Card** (dark, `rounded-3xl`, shadow-xl):
- Top row: `"Catsy Cafe Card"` (left, monospace, muted) | `"{unspentCount}/{TOTAL_STAMPS}"` counter (right)
- 3×3 grid of 9 circles — earned = brand-accent + glow + Catsy logo; unearned = `bg-white/10` translucent
- Bottom message states:
  - `"{n} more stamp(s) to unlock a free drink"`
  - `"🎉 Reward Unlocked! Claim your free drink."`

**Claim Button** (shown only when 9 stamps earned): Gift icon + `"Claim Free Drink"` — dark pill, full-width.

**Your Stash** section (Gift icon + `"Your Stash"` heading):
- Each card: reward name (bold) | `"Code: {code}"` (monospace, green) or `"Redeemed"` | status badge pill | `"View QR"` button
- Empty state: dashed card + `"Keep sipping to earn more!"`

**Modals:**
- Claim bottom-sheet: `"Choose Your Free Drink"` title | `"This will use 9 of your stamps."` | drink selector list | `"Confirm Claim"` / `"Processing…"` button
- View QR overlay: reward name + `"Show this QR to staff to redeem"` + QR image + monospace code + `"Done"`
- New reward modal: green CheckCircle + `"Reward Claimed! 🎉"` + `"Show this QR to the staff to redeem"` + QR + `"Done"`

# C-04 Profile
Page title: `"My Profile"` (4xl bold). Edit button (top-right): Edit2 icon + `"Edit"` — pill, neutral-100 bg.

**Identity Hub card** (dark, `rounded-3xl`): avatar initials + name + email + QR code.

**Editable fields** (view = underline border / edit = brand-accent underline input):
- Labels: `"First Name"` / `"Last Name"` / `"Email"` / `"Contact Number"` / `"Account Password"`
- Password hint in edit mode: `"* Leave empty to keep current password."`
- Same strength bar + checklist as Login sign-up

**Edit action buttons:** X icon + `"Cancel"` (neutral-100 pill) | Save icon + `"Save Changes"` (neutral-900 pill)

**Sections:**
- Heart icon + `"Favorite"` — horizontal pill chips of saved items
- Clock icon + `"Transaction History"` — rows: date (bold) + `"Tap to rate"` or `"{avg} ★"` → opens Review Modal
- Calendar icon + `"Reservation History"` — rows: datetime + guest count + status badge
- Empty states: `"No transaction history yet."` / `"No previous reservations."`

**Review Modal** (bottom sheet):
- Title `"Transaction Details"` + date | `"Bought Items"` panel (items list + `"Total: {price}"`)
- `"Rate your experience"` heading. 3 rows: `"Drinks"` / `"Service"` / `"Place"` — 5 interactive stars each
- Label `"Tell us more details"` + `"(optional)"` — textarea placeholder `"What did you like? What could be better?"`
- `"Submit Review"` button (disabled until all 3 rated)

**Toasts:** `"No Changes Detected"` (error) | confirm `"Update Profile?"` / `"Are you sure you want to save these changes to your profile details?"` / confirm label `"Yes, Update"` | success `"Update Complete"` / `"Your profile has been successfully updated."`

# C-05 Reservation
**Dark header** (`bg-neutral-900`):
- Title: `"Secure Your Spot"` (4xl–5xl, white, centered)
- Subtitle: `"Reserve a table at Catsy Coffee and enjoy premium brews in a relaxing atmosphere."`
- Availability badge: `"{n} Tables Currently Available"` (pulsing green/red dot)

**White form sheet** (rises below, `rounded-t-3xl`):
- Sub-header: `"Reservation Details"` | right link (guests): `"Log in for auto-fill"`
- Sub-label: `"Please review your booking details before confirming."`
- Closed banner (when restaurant is closed): Warning icon + `"We're Closed Today"` + `"We are not accepting any more reservations for today, but you can still book for future dates!"`

**Form field labels & placeholders:**
- `"First Name"` / `"e.g. John"` | `"Last Name"` / `"e.g. Doe"`
- `"Email Address"` / `"e.g. coffee@catsy.com"` | `"Contact Number"` / `"e.g. +63 900 000 0000"`
- `"Date & Time"` (datetime-local, shows opening hours hint) | `"Guests"` (dropdown 1–8 People)
- `"Special Request (Optional)"` / `"e.g. Near the window, high chair needed..."`

**Submit:** `"Confirm Reservation"` pill button | loading: `"Processing..."`
**Loading overlay:** `"Securing your table..."` + `"Please do not refresh the page."`

**Post-submit states:**
- Pending: yellow circle + Calendar icon + `"Waiting for Confirmation"` + `"Your request has been received. Please wait while our staff reviews and confirms your booking."`
- Confirmed: green circle + Check icon (glow) + `"Reservation Confirmed!"` + `"Your reservation has been successfully booked. We look forward to serving you!"`
- Booking summary card rows: `Status` | `Name` | `Contact` | `Date & Time` | `Guests` | `Special Request`

**Toasts:**
- Pre-submit confirm: `"Confirm Reservation details"` / `"Please confirm your reservation for {n} people on {date}."` — buttons: `"Confirm Booking"` / `"Cancel"`
- Success: `"Request Sent"` / `"Thank you, {firstName}! Your reservation request has been submitted. We will notify you once confirmed."`
- Closed-today block: `"Closed Today"` / `"Sorry, we are closed for today. Please feel free to select a future date for your reservation!"`
- Error: `"Reservation Failed"` / `"There was an issue processing your reservation. Please try again."`

---

# ADMIN SCREENS

# A-00 Admin Login (`/admin/login`)
Full-page `neutral-900`. Radial gradient bg. Tilted coffee icon tile (hover = `rotate-0` transitions).
- Headline: `"Backstage Admin"` (4xl, font-black) — sub: `"Authorized Personnel Only"` (xs uppercase tracked)
- Frosted glass card (`neutral-800/50`, `backdrop-blur`, `rounded-[2.5rem]`, `border-white/5`)
- Label `"Admin Email"` — Mail icon input — placeholder `"your@email.com"`
- Label `"Access Key"` — Lock icon input — Eye/EyeOff toggle — placeholder `"••••••••"`
- Submit: `"Unlock Dashboard"` + ShieldCheck icon (white bg, neutral-900 text). Loading: `Loader2` spinner only.
- **Success state:** green circle + ShieldCheck + `"Access Granted"` + `"Redirecting to dashboard..."`
- **Error state:** red-10 banner + AlertCircle + error text (shake animation)
- Footer link: `"← Back to Main Store"`

# A-01 Admin Layout (shared)
Full-page `neutral-900`, `text-white`, `p-10`.

**Header** (`AdminHeader`):
- Title: `"Backstage Admin"` (4xl bold)
- Tab group (`neutral-800/50` pill container, `rounded-xl`, `border-neutral-700/50`) — active tab = `neutral-700` bg + shadow:
  - Coffee icon + `"Products"` | Grid icon + `"Claimable Rewards"` | Flask icon + `"Inventory"` *(amber glow dot badge when low stock)* | Users icon + `"Accounts"` | Book icon + `"Reservations"` | Gift icon + `"Loyalty"`
- Profile circle button (Users icon) — active: `border-brand-accent` + glow
- Vertical divider
- Logout button (LogOut icon) — hover: `text-red-500`

**Global processing overlay** (fullscreen, `z-200`, dark blur):
- Neutral-900 card + `Loader2` spinning brand-accent icon + bold message (e.g. `"Saving Product..."`) + `"Please do not close this window"`

**StatusModal** (confirm dialogs): icon circle (green/red/blue) + title + message + `"Confirm"` / `"Cancel"` buttons. Delete confirm label changes to `"Delete"`. Logout confirm: `"Sign Out"` title + `"Are you sure you want to sign out?"` + `"Sign Out"` / `"Cancel"`.

# A-02 Products Tab
`"+ Add Product"` green button (`bg-green-600`, `rounded-2xl`, Plus icon). Category pill filter tabs. Sort buttons.
Each product row: name + category badge + price + availability pill + Edit (pencil) + Delete (trash).
Delete confirm: `"Confirm Delete"` / `"This action cannot be undone. Are you sure you want to delete this product?"` / label `"Delete"`.
Save confirm: `"Confirm Save"` / `"Are you sure you want to save these chasdnges to this product?"`
Save success: `"Success!"` / `"Product has been saved successfully."`
Delete success: `"Deleted"` / `"Product has been removed."`


a

# A-04 Reservations Tab
Title: `"Reservation Dashboard"` (BookOpen icon) — sub: `"Real-time floor management"` (uppercase tracked).

**Section 1 — `"Action Required ({n})"`** (yellow pulsing dot): full-width grid of pending cards.
**Section 2 — two-column layout:**
- Left: `"Store Operational Sync"` (Settings icon) — Open/Close toggle button: `"Open"` (ToggleRight, green) / `"Closed"` (ToggleLeft, red) / loading: `"Updating..."`
  - Stats grid (4 tiles): `"Total Tables"` | `"Occupied"` | `"Available"` | `"Floor Status"` (`"Active"` / `"Offline"`)
  - Hours row: `"Opening"` | `"Closing"` (monospace values)
  - Toggle: `"Expand Advanced Controls"` / `"Collapse Settings"` (white bg button)
  - Advanced panel fields: `"Opening"` / `"Closing"` (time) / `"Capacity"` / `"Available"` (number)
  - Save button: `"Confirm New Config"` (green) / loading: `"Saving..."`
- Right: `"Accepted & Live ({n})"` (Check icon, green) — confirmed reservations list. Empty: `"No Active Reservations"`.

**Reservation card fields:** status badge (pill) + `#{id}` hash (top) | Customer name (User icon) | datetime (Clock icon) | `"{n} Guests"` (Calendar icon) | special requests (amber AlertTriangle, italic quoted) | `"Phone:"` label

**Action buttons per status:**
- `pending` → Check icon + `"Confirm"` (green) | X icon + `"Cancel"` (red)
- `confirmed` → Check icon + `"Complete"` (blue) | X icon + `"Cancel"` (red)

**Section 3 — `"Recent History / Archive"`** (Clock icon): 4-col grid of past cards (completed/cancelled), `opacity-70` hover = full.
Loading: `"Synchronizing Cloud Data..."` fullscreen overlay.

# A-05 Loyalty Redeem Tab
Title: `"Redeem Loyalty Reward"` (Gift icon in brand-accent/10 circle) — sub: `"Enter or scan the customer's coupon code."`

Input row:
- Monospace `text-lg tracking-widest` input — placeholder `"e.g. A1B2C3D4"` — maxLength 8 — auto-uppercases
- Search icon + `"Redeem"` button (brand-accent bg). Loading: spinner + `"Checking…"`

**Error state** (red-10 card): AlertTriangle + `"Redemption Failed"` + error msg + `"Try another code →"` link.
**Success state** (green-10 card): CheckCircle + `"Reward Redeemed!"` + detail rows: `"Drink"` / `"Code"` (monospace, brand-accent) / `"Status"` (uppercase green) + `"Redeem Another"` button.

# A-06 Inventory Tab
Title: `"Raw Materials Inventory"` — `"+ Add Material"` green button (Plus icon, `rounded-2xl`).
Each material row: name, unit (`grams`/`ml`/`pcs`), current stock (bold), reorder level, cost per unit, amber low-stock badge when stock < threshold. Edit + Delete per row.
Amber glowing dot appears on `"Inventory"` tab in header bar when any material is below reorder level.

---

## Routing Map

| Route | Screen |
|---|---|
| `/home` | Home |
| `/login` `/signup` | Auth |
| `/loyalty` | Stamp Card |
| `/profile` | Profile |
| `/reservation` | Reservation |
| `/admin/login` | Admin Login |
| `/admin` | Admin Dashboard |

Generate customer screens at **375px**, admin at **1440px**. Link screens using routing map for prototype flow.
