# Milestone 2: Front-End UI Realization (Web & Mobile)

> **Status:** In Progress · Due: March 13, 2026
> **Focus:** Transform the data connection from Milestone 1 into a fully visual, interactive experience for both the **Customer Web App** (React) and the **Staff POS** (Flutter).

---

## 🛠️ Development Strategy

All frontend issues follow a **2-phase approach** so the team can work before the backend is ready:

| Phase | What to do |
|---|---|
| **Phase 1 — Mock Data** | Build and style the full UI using hardcoded/fake data |
| **Phase 2 — Integration** | Replace mock data with real API calls to the live backend |

> **Rule:** Phase 1 can always start immediately. Phase 2 requires the backend endpoint to be ready. If an issue has a `🔒 Blocked by [BE]` note, wait for that backend issue to close before starting Phase 2.

---

## 🏷️ Labels Used in This Milestone

| Label | Color | Purpose |
|---|---|---|
| `frontend` | `#0075ca` | Any UI/visual work |
| `UI/UX` | `#e4e669` | Design & layout tasks |
| `Web` | `#bfd4f2` | Targets the React web app |
| `mobile` | `#d93f0b` | Targets the Flutter POS app |
| `backend` | `#b60205` | API/endpoint work |
| `milestone2` | `#f9d0c4` | Belongs to this milestone |
| `skeleton` | `#fef2c0` | Initial structure only, no logic |
| `integration` | `#c2e0c6` | Wiring UI to live API |
| `bug` | `#d73a4a` | Known bugs to fix |
| `enhancement` | `#a2eeef` | Improving existing feature |

---

## ⚙️ Backend Issues (api-bridge — FastAPI)

> These must be completed **before** affected frontend Phase 2 work begins.
> Frontend Phase 1 (mock data) can start independently at any time.

> **Note on Backend Status:** The current `catsy-backend/app/main.py` is a skeleton file. Only the following basic routes have been created today by the team lead: `GET /products`, `GET /categories`, `GET /api/settings`, `GET /api/events/stream`. The full auth, loyalty, reservation, and admin routing from Milestone 1 is **presumed to be in a separate, older repository or branch** and is not yet present in `main.py`.

---

### Issue #P1 — `[BE] SSE: Verify & Stabilize Event Stream for Reservations`
**Labels:** `backend` `milestone2`

**Status: 🟡 Partially Complete**
- [x] Basic SSE heartbeat stream implemented at `GET /api/events/stream` *(added today)*
- [ ] Verify stream correctly delivers `reservation.updated` events when `PATCH /api/staff/reservations/:id` is called
- [ ] Confirm event payload shape: `{ action: "status_changed", id, status }`
- [ ] Test delivery on web browser (EventSource API) and Flutter HTTP client
- [ ] Handle reconnection if the SSE stream drops

**File:** `app/main.py` — `event_generator()` is a heartbeat ping only. Must be upgraded to deliver real events.
**Unblocks:** Issue #D2 (Web Reservation live status), Issue #H1 (POS Dashboard)

---

### Issue #P2 — `[BE] Loyalty: Add Staff Stamp Endpoint`
**Labels:** `backend` `milestone2`

**Status: 🔴 Not Started**
- [ ] Route: `POST /loyalty/stamp` — requires `staff` JWT role
- [ ] Request body: `{ customer_id: string }`
- [ ] Insert one stamp record into the `loyalty_stamps` table
- [ ] Publish a loyalty event via the internal `EventBus`
- [ ] Return: updated stamp count `{ customer_id, new_stamp_count }`

**Files to modify:** `app/routers/staff.py`, `app/services/loyalty_service.py`
**Unblocks:** Issue #J1 (POS Payment auto-stamp)

---

### Issue #P3 — `[BE] Loyalty: Add Staff-Facing Customer Lookup Endpoint`
**Labels:** `backend` `milestone2`

**Status: 🔴 Not Started**
- [ ] Route: `GET /loyalty/status/{customer_id}` — requires `staff` JWT role
- [ ] Returns same shape as `GET /loyalty/status` but for any given customer
- [ ] Return 404 if customer not found

**File to modify:** `app/routers/loyalty.py` → add to `staff_router`
**Unblocks:** Issue #K1, #K2, #K3 (POS Loyalty screens)

---

### Issue #P4 — `[BE] Reservations: Add Staff Walk-In Creation Endpoint`
**Labels:** `backend` `milestone2`

**Status: 🔴 Not Started**
- [ ] Route: `POST /api/staff/reservations` — requires `staff` JWT role
- [ ] Request body: `{ first_name, last_name, phone, email?, reservation_time, guest_count, special_requests? }`
- [ ] `user_id` is **not required** (walk-in guests)
- [ ] Publish `RESERVATION_UPDATED` SSE event after creation

**File to modify:** `app/routers/reservation.py`
**Unblocks:** Issue #L2 (POS Walk-In Booking Form)

---

---

## 📋 Web App Issues (catsy-coffee-web — React)

---

### Feature 1: Home Page — Storefront Structure

> **Page:** `HomePage.jsx` ✅ **EXISTS at `/mnt/datadrive/Project/Catsy-Final/catsy-web/src/pages/HomePage.jsx`**

---

#### Issue #A1 — `[WEB] Home Page: Navigation Bar`
**Labels:** `frontend` `UI/UX` `Web` `milestone2`

**Status: 🔴 Stub Only — Needs Full Implementation**

> `Navbar.jsx` exists but is a plain skeleton with basic links only (no auth state, no design).

**Phase 1 — Mock Data:**
- [ ] Create a `mockAuth.js` with `isLoggedIn: false` and a sample user object
- [ ] Render full nav layout using mock auth state
- [ ] Style: logo left, nav links right, hamburger for mobile

**Phase 2 — Integration:**
- [ ] Replace mock auth with real `UserContext` (`useUser()` hook)
- [ ] If not logged in → show: `Home`, `Login`, `Reservation`
- [ ] If logged in → show: `Home`, `Profile`, `Loyalty Card`, `Logout`
- [ ] Logout clears JWT and redirects to Home

**Endpoint(s):** None — uses auth context only

---

#### Issue #A2 — `[WEB] Home Page: Hero Section`
**Labels:** `frontend` `UI/UX` `Web` `milestone2`

**Status: 🟢 Fully Implemented**

> `HeroSection.jsx` exists and is integrated into `HomePage.jsx`. Shows branding, GSAP logo animation, CTAs, and uses `SettingsContext` / `UserContext`.

**Phase 1 — Mock Data:**
- [x] Build full hero layout: branding, background visual, two CTA buttons
- [x] Show Open/Closed badge using `is_open` value

**Phase 2 — Integration:**
- [x] Fetch `GET /api/settings` on load via `SettingsContext`
- [x] Dynamically update Open/Closed badge from live setting
- [x] CTA Primary: `Reserve a Table` → navigate to `/reservation`
- [x] CTA Secondary: `Login` → navigate to `/login`

**Endpoint(s):** `GET /api/settings` ✅

---

#### Issue #A3 — `[WEB] Home Page: Featured Products Section`
**Labels:** `frontend` `UI/UX` `Web` `integration` `milestone2`

**Status: 🟢 Fully Implemented**

> `UnifiedMenu.jsx` is integrated into `HomePage.jsx` and fetches from live API.

**Phase 1 — Mock Data:**
- [x] Build product card grid (image, name, price)
- [x] Build category dropdown filter

**Phase 2 — Integration:**
- [x] Fetch products from `GET /products` (live data confirmed working)
- [x] Fetch categories from `GET /categories` (live data confirmed working)
- [x] Handle loading skeleton and empty state

**Endpoint(s):** `GET /products` ✅, `GET /categories` ✅

---

#### Issue #A4 — `[WEB] Home Page: Full Product Menu List`
**Labels:** `frontend` `UI/UX` `Web` `integration` `milestone2`

**Status: 🟢 Fully Implemented**

> `UnifiedMenu.jsx` implements the full product list grouped by category.

**Phase 1 — Mock Data:**
- [x] Render a list of all available products: Name, Price, Category tag

**Phase 2 — Integration:**
- [x] Replace mock list with live `GET /products`
- [x] Show loading spinner while fetching
- [x] Show message if list is empty

**Endpoint(s):** `GET /products` ✅

---

#### Issue #A5 — `[WEB] Home Page: Location & Info Section`
**Labels:** `frontend` `UI/UX` `Web` `milestone2`

**Status: 🟢 Fully Implemented**

> `LiveFloorMap.jsx` is integrated into `HomePage.jsx` and shows map, table availability, and store info.

**Phase 1:**
- [x] Embed map and show store info

**Phase 2 — Integration:**
- [x] Show operating hours from `GET /api/settings`
- [x] Show live table availability from `tablesData` prop (from `useTableAvailability` hook)

**Endpoint(s):** `GET /api/settings` ✅

---

### Feature 2: Authentication Pages

> **Page:** `LoginPage.jsx` ✅ **EXISTS**

---

#### Issue #B1 — `[WEB] Login Page: Customer Login Form`
**Labels:** `frontend` `UI/UX` `Web` `integration` `milestone2`

**Status: 🟢 Fully Implemented**

> `LoginPage.jsx` contains a full login form and calls `POST /customer/login`.

- [x] Build full login form layout
- [x] Call `POST /customer/login` with `{ username, password }`
- [x] On success: store JWT in localStorage, update `UserContext`, navigate to `/profile`
- [x] On failure: show real error message from API response

**Endpoint(s):** `POST /customer/login` ✅

---

#### Issue #B2 — `[WEB] Login Page: Customer Sign Up Form`
**Labels:** `frontend` `UI/UX` `Web` `integration` `milestone2`

**Status: 🟢 Fully Implemented**

> `LoginPage.jsx` contains a toggle to the sign-up form and calls `POST /customer/signup`.

- [x] Add toggle: "Don't have an account? Sign Up"
- [x] Build sign-up form with all required fields
- [x] Call `POST /customer/signup` with all fields
- [x] On success: auto-login and navigate to `/profile`
- [x] On failure: display field-level error messages

**Endpoint(s):** `POST /customer/signup` ✅

---

### Feature 3: Customer Profile Page

> **Page:** `ProfilePage.jsx` ✅ **EXISTS**

---

#### Issue #C1 — `[WEB] Profile Page: View & Edit Profile`
**Labels:** `frontend` `UI/UX` `Web` `integration` `milestone2`

**Status: 🟢 Fully Implemented**

> `ProfilePage.jsx` is a 28KB file with full profile management.

- [x] Display all fields in read-only view
- [x] Add "Edit Profile" button to switch to editable form mode
- [x] Load from `GET /customer/:id`
- [x] On save: call `PUT /customer/update/:id`
- [x] Show real success/error toast from API response

**Endpoint(s):** `GET /customer/:id` ✅, `PUT /customer/update/:id` ✅

---

### Feature 4: Reservation Page

> **Page:** `ReservationPage.jsx` ✅ **EXISTS**

---

#### Issue #D1 — `[WEB] Reservation Page: Booking Form`
**Labels:** `frontend` `UI/UX` `Web` `integration` `milestone2`

**Status: 🟢 Fully Implemented**

> `ReservationPage.jsx` is a 27KB file with full booking form.

- [x] Build full form with all required fields
- [x] Auto-fill personal fields from `UserContext` if logged in
- [x] Fetch `GET /api/settings` for operating hours and open/close status
- [x] On confirm: call `POST /api/customer/reservations`
- [x] Show success toast on submission

**Endpoint(s):** `POST /api/customer/reservations` ✅, `GET /api/settings` ✅

---

#### Issue #D2 — `[WEB] Reservation Page: Active Booking Status View`
**Labels:** `frontend` `UI/UX` `Web` `integration` `milestone2`

**Status: 🟡 Phase 1 & 2 Complete, SSE Partial**

> Booking status card is implemented and fetches from live API. SSE for real-time updates is connected but the event stream currently only sends heartbeat pings (no real `reservation.updated` events yet).

- [x] Show card if `pending` or `confirmed` reservation found
- [x] Style status badge: yellow = `pending`, green = `confirmed`, red = `cancelled`
- [x] Fetch `GET /api/customer/reservations` on page load
- [ ] Live SSE `reservation.updated` events — **Blocked by `[BE] #P1`**

**Endpoint(s):** `GET /api/customer/reservations` ✅, SSE ⚠️ heartbeat only

---

### Feature 5: Loyalty Card Page

> **Page:** `LoyaltyPage.jsx` ✅ **EXISTS**

---

#### Issue #E1 — `[WEB] Loyalty Page: Stamp Card UI`
**Labels:** `frontend` `UI/UX` `Web` `integration` `milestone2`

**Status: 🟢 Fully Implemented**

- [x] Build 9-circle stamp grid
- [x] Stamped circles: show Catsy logo, unstamped: empty circle outline
- [x] Show progress text (e.g. `5 / 9 stamps collected`)
- [x] Fetch `GET /loyalty/status` on page load

**Endpoint(s):** `GET /loyalty/status` ✅

---

#### Issue #E2 — `[WEB] Loyalty Page: Claim Reward`
**Labels:** `frontend` `UI/UX` `Web` `integration` `milestone2`

**Status: 🟢 Fully Implemented**

- [x] Show "Claim Free Drink" button only when `unspent_count >= 9`
- [x] Build drink selection dropdown
- [x] On claim: call `POST /loyalty/claim`
- [x] Display real coupon code returned from API
- [x] Show history of claimed rewards

**Endpoint(s):** `GET /loyalty/status` ✅, `POST /loyalty/claim` ✅

---

### Feature 6: Admin Panel (Web)

> **Pages:** `AdminPage.jsx`, `admin/components/` ✅ **EXISTS**

---

#### Issue #F1 — `[WEB] Admin: Login Page`
**Labels:** `frontend` `UI/UX` `Web` `milestone2`

**Status: 🟢 Fully Implemented**

> `admin/components/AdminLogin.jsx` exists and is wired to `POST /admin/login`.

- [x] Build login form
- [x] Call `POST /admin/login`
- [x] On success: store JWT, update `UserContext` with admin/staff role
- [x] Block customer-role logins

**Endpoint(s):** `POST /admin/login` ✅

---

#### Issue #F2 — `[WEB] Admin: Dashboard Overview`
**Labels:** `frontend` `UI/UX` `Web` `integration` `milestone2`

**Status: 🟢 Fully Implemented**

> `AdminPage.jsx` is a 14KB file with full dashboard.

- [x] Build Open/Close toggle
- [x] Show summary stat cards (total orders, revenue)
- [x] Show recent reservations table
- [x] Fetch `GET /api/settings` for open/close status
- [x] Toggle → call `PATCH /api/admin/settings`
- [x] Fetch `GET /api/staff/reservations` for recent reservations

**Endpoint(s):** `GET /api/settings` ✅, `PATCH /api/admin/settings` ✅, `GET /api/staff/reservations` ✅

---

#### Issue #F3 — `[WEB] Admin: Reservation Management Panel`
**Labels:** `frontend` `UI/UX` `Web` `integration` `milestone2`

**Status: 🟢 Fully Implemented**

> `AdminPage.jsx` includes a reservation management panel with filter tabs, action buttons, and live API calls.

- [x] Build reservation table with status badges and action buttons (`Confirm`, `Reject`, `Complete`)
- [x] Add status filter tabs: All / Pending / Confirmed / Completed
- [x] Fetch `GET /api/staff/reservations`
- [x] Action buttons: call `PATCH /api/staff/reservations/:id` with new status
- [ ] List auto-refreshes via SSE `reservation.updated` event — **Blocked by `[BE] #P1`**

**Endpoint(s):** `GET /api/staff/reservations` ✅, `PATCH /api/staff/reservations/:id` ✅

---

---

## 📱 POS App Issues (catsy_pos — Flutter)

> ⚠️ **Current Mobile Status:** The Flutter mobile app (`catsy-mobile/`) currently only has **4 skeleton stub screens** (Home, Menu, Profile, MainShell). **None of the POS features listed below have been started.** This is the primary focus area for the rest of the milestone sprint.

---

### Feature 7: Authentication (POS)

---

#### Issue #G1 — `[POS] Auth: Login & Splash Screen`
**Labels:** `frontend` `UI/UX` `mobile` `milestone2`

**Status: 🔴 Not Started**
- [ ] Build splash screen with Catsy logo and loading indicator
- [ ] Build login form: Username, Password, Login button
- [ ] On submit with mock creds: navigate to Dashboard
- [ ] Call `POST /admin/login`
- [ ] Store JWT using Flutter Secure Storage
- [ ] On failure: show API error message

**Endpoint(s):** `POST /admin/login`

---

### Feature 8: Dashboard (POS)

---

#### Issue #H1 — `[POS] Dashboard: Main Overview Screen`
**Labels:** `frontend` `UI/UX` `mobile` `integration` `milestone2`

**Status: 🔴 Not Started**
- [ ] Build stat cards: orders today, revenue
- [ ] Build table grid with color-coded status chips (available/occupied/reserved)
- [ ] Build Open/Close toggle button
- [ ] Add quick action nav buttons (New Order, Reservations, Loyalty)
- [ ] Fetch `GET /api/settings` for open/close toggle
- [ ] Toggle → call `PATCH /api/admin/settings`
- [ ] Subscribe to SSE for real-time table updates *(Blocked by `[BE] #P1`)*

**Endpoint(s):** `GET /api/settings`, `PATCH /api/admin/settings`, SSE `GET /api/events`

---

### Feature 9: Product Catalog & Order Builder (POS)

---

#### Issue #I1 — `[POS] Order: Product Catalog Screen`
**Labels:** `frontend` `UI/UX` `mobile` `integration` `milestone2`

**Status: 🔴 Not Started**
- [ ] Build 2-column product grid: image, name, price, stock badge
- [ ] Build search bar to filter products by name
- [ ] Build category chips to filter products
- [ ] Tap on product: add to cart, show snackbar
- [ ] Fetch `GET /products` and `GET /categories`

**Endpoint(s):** `GET /products`, `GET /categories`

---

#### Issue #I2 — `[POS] Order: Order Builder / Cart Screen`
**Labels:** `frontend` `UI/UX` `mobile` `milestone2`

**Status: 🔴 Not Started**
- [ ] Display each cart item: product name, quantity controls (+/−), line total
- [ ] Remove item button
- [ ] Show cart subtotal at the bottom
- [ ] "Proceed to Payment" button → navigate to Order Summary
- [ ] Wire to real `CartProvider` (Riverpod state)

**Endpoint(s):** State-only (no API call needed)

---

#### Issue #I3 — `[POS] Order: Order Summary Screen`
**Labels:** `frontend` `UI/UX` `mobile` `bug` `milestone2`

**Status: 🔴 Not Started**

> ⚠️ **Bug:** This screen currently renders `"Order Summary — TODO"` only. Must be built from scratch.

- [ ] Display full order list: item name, quantity, add-ons, line total
- [ ] Show grand total
- [ ] "Confirm & Pay" button → navigate to Payment Screen
- [ ] Read from live `CartProvider` instead of mock

**Endpoint(s):** State-only (CartProvider)

---

### Feature 10: Payment & Receipt (POS)

---

#### Issue #J1 — `[POS] Checkout: Payment Screen`
**Labels:** `frontend` `UI/UX` `mobile` `integration` `milestone2`

**Status: 🔴 Not Started**
- [ ] Display order total
- [ ] Build payment method selector: Cash / Card
- [ ] Cash mode: input for "Amount Tendered", auto-calculate change
- [ ] On confirm: call `POST /api/orders` with full order payload
- [ ] On success: call `POST /loyalty/stamp` with `{ customer_id }` *(Blocked by `[BE] #P2`)*
- [ ] Navigate to Receipt screen

**Endpoint(s):** `POST /api/orders`, `POST /loyalty/stamp`
> 🔒 **Blocked by:** `[BE] Issue #P2`

---

#### Issue #J2 — `[POS] Checkout: Receipt Screen`
**Labels:** `frontend` `UI/UX` `mobile` `milestone2`

**Status: 🔴 Not Started**
- [ ] Display full receipt: item list, total, payment method, change
- [ ] Receipt-style layout (monospace font, dividers)
- [ ] "Print / Share" button (placeholder action)
- [ ] "New Order" button → clear cart and navigate to Product Catalog
- [ ] Receive real order data from the Payment screen via navigation arguments

**Endpoint(s):** None (data passed from Payment screen)

---

### Feature 11: Loyalty & Rewards (POS)

---

#### Issue #K1 — `[POS] Loyalty: QR Scanner Screen`
**Labels:** `frontend` `UI/UX` `mobile` `integration` `milestone2`

**Status: 🔴 Not Started**
- [ ] Build camera QR scanner UI layout
- [ ] On real QR scan: extract `customer_id`
- [ ] Call `GET /loyalty/status/{customer_id}` *(Blocked by `[BE] #P3`)*

**Endpoint(s):** `GET /loyalty/status/{customer_id}`
> 🔒 **Blocked by:** `[BE] Issue #P3`

---

#### Issue #K2 — `[POS] Loyalty: Customer Search Screen`
**Labels:** `frontend` `UI/UX` `mobile` `integration` `milestone2`

**Status: 🔴 Not Started**
- [ ] Build a search input (by name or phone)
- [ ] Call `GET /loyalty/status/{customer_id}` after finding the customer *(Blocked by `[BE] #P3`)*

**Endpoint(s):** `GET /loyalty/status/{customer_id}`
> 🔒 **Blocked by:** `[BE] Issue #P3`

---

#### Issue #K3 — `[POS] Loyalty: Redeem Reward Screen`
**Labels:** `frontend` `UI/UX` `mobile` `integration` `bug` `milestone2`

**Status: 🔴 Not Started**

> ⚠️ **Bug:** Staff ID is currently hardcoded as `'staff-001'`. Must be pulled from auth session.

- [ ] Build coupon code input field
- [ ] Call `POST /loyalty/redeem` with `{ coupon_code: enteredCode }`
- [ ] Fix hardcoded `_staffId = 'staff-001'` → pull from `authNotifierProvider`
- [ ] On success: show confirmed redemption details

**Endpoint(s):** `POST /loyalty/redeem`

---

### Feature 12: Reservation Management (POS)

---

#### Issue #L1 — `[POS] Reservations: List & Management Screen`
**Labels:** `frontend` `UI/UX` `mobile` `integration` `milestone2`

**Status: 🔴 Not Started**
- [ ] Build scrollable list: Name, Date, Guest Count, Status badge
- [ ] Add filter chips: All / Pending / Confirmed / Completed
- [ ] Tap reservation → detail bottom sheet with Confirm / Reject / Complete buttons
- [ ] Fetch `GET /api/staff/reservations`
- [ ] Action buttons: call `PATCH /api/staff/reservations/:id`

**Endpoint(s):** `GET /api/staff/reservations`, `PATCH /api/staff/reservations/:id`

---

#### Issue #L2 — `[POS] Reservations: Walk-In Booking Form`
**Labels:** `frontend` `UI/UX` `mobile` `integration` `bug` `milestone2`

**Status: 🔴 Not Started**
- [ ] Build form: Name, Phone, Date/Time picker, Guest Count, Special Requests
- [ ] Call `POST /api/staff/reservations` *(Blocked by `[BE] #P4`)*

**Endpoint(s):** `POST /api/staff/reservations`
> 🔒 **Blocked by:** `[BE] Issue #P4`

---

### Feature 13: Table Management (POS)

---

#### Issue #M1 — `[POS] Tables: Table Status Grid`
**Labels:** `frontend` `UI/UX` `mobile` `milestone2`

**Status: 🔴 Not Started**
- [ ] Build grid of table cards: table number, status chip (Available/Occupied/Reserved)
- [ ] Tap table → show dialog to change its status
- [ ] Sync table data from Dashboard state

---

### Feature 14: Inventory Overview (POS)

---

#### Issue #N1 — `[POS] Inventory: Stock Overview Screen`
**Labels:** `frontend` `UI/UX` `mobile` `milestone2`

**Status: 🔴 Not Started**
- [ ] Build list: Product name, stock count, low-stock warning badge (highlight if stock < 5)
- [ ] Manual stock adjustment: tap product → input dialog to set new count
- [ ] Sync inventory from `inventoryMapProvider` (Riverpod / local Drift DB)

---

### Feature 15: Order History (POS)

---

#### Issue #O1 — `[POS] History: Order & Transaction List`
**Labels:** `frontend` `UI/UX` `mobile` `milestone2`

**Status: 🔴 Not Started**
- [ ] Build scrollable list: Order ID, Date, Total amount, Payment method
- [ ] Tap order → expand to show item breakdown
- [ ] Fetch real order history from local Drift DB (`OrderDao`), sorted by date descending

---

---

## 🎯 Milestone 2 Complete When:

| Check | Done? |
|---|---|
| All 6 customer web pages are UI-complete and wired to live endpoints | ✅ Complete |
| Admin panel can manage reservations and toggle restaurant open/close | ✅ Complete |
| POS auth, catalog, order builder, payment, and receipt screens are functional | 🔴 Not Started |
| POS loyalty (QR scan + manual) and reward redemption work correctly | 🔴 Not Started |
| `order_summary_screen.dart` is no longer a TODO stub | 🔴 Not Started |
| Hardcoded staff ID bug is fixed in `claim_reward_screen.dart` | 🔴 Not Started |
| No mock / static data remains in any screen that has a live API | ✅ Web Complete · 🔴 Mobile Not Started |
| All 4 `[BE]` issues (#P1–#P4) are merged and tested | 🟡 #P1 Partial Only |
| SSE-driven reservation status updates work on both web and POS | 🔴 Not Started |

---

## 🔌 Endpoint Summary Reference

| Endpoint | Method | Status | Used By |
|---|---|---|---|
| `GET /products` | GET | ✅ Exists | Web #A3, #A4 · POS #I1 |
| `GET /categories` | GET | ✅ Exists | Web #A3 · POS #I1 |
| `GET /api/settings` | GET | ✅ Exists | Web #A2, #A5, #D1 · POS #H1 |
| `PATCH /api/admin/settings` | PATCH | ✅ Exists | Web #F2 · POS #H1 |
| `POST /customer/login` | POST | ✅ Exists | Web #B1 |
| `POST /customer/signup` | POST | ✅ Exists | Web #B2 |
| `GET /customer/:id` | GET | ✅ Exists | Web #C1 |
| `PUT /customer/update/:id` | PUT | ✅ Exists | Web #C1 |
| `POST /admin/login` | POST | ✅ Exists | Web #F1 · POS #G1 |
| `GET /api/customer/reservations` | GET | ✅ Exists | Web #D2 |
| `POST /api/customer/reservations` | POST | ✅ Exists | Web #D1 |
| `GET /api/staff/reservations` | GET | ✅ Exists | Web #F2, #F3 · POS #L1 |
| `PATCH /api/staff/reservations/:id` | PATCH | ✅ Exists | Web #F3 · POS #L1 |
| `POST /api/staff/reservations` | POST | ❌ Missing | POS #L2 → `[BE] #P4` |
| `GET /loyalty/status` | GET | ✅ Exists | Web #E1, #E2 |
| `POST /loyalty/claim` | POST | ✅ Exists | Web #E2 |
| `POST /loyalty/redeem` | POST | ✅ Exists | POS #K3 |
| `GET /loyalty/status/{customer_id}` | GET | ❌ Missing | POS #K1, #K2, #K3 → `[BE] #P3` |
| `POST /loyalty/stamp` | POST | ❌ Missing | POS #J1 → `[BE] #P2` |
| `POST /api/orders` | POST | ✅ Exists | POS #J1 |
| `GET /api/events/stream` (SSE) | GET | 🟡 Heartbeat Only | Web #D2 · POS #H1 → upgrade `[BE] #P1` |
