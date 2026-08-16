<div align="center">

# 🔑 STArt — Role-Based Access Control
## Evaluator & Testing Guide

> *A complete, step-by-step walkthrough for professors, evaluators, and team members to explore all three role-based dashboards.*

</div>

---

## 📋 Permission Matrix — At a Glance

| Feature | 👤 User | 🔬 System Analyst | 👑 Admin |
| :--- | :---: | :---: | :---: |
| **Route** | `/dashboard` | `/analyst-dashboard` | `/admin-dashboard` |
| **View Own Subscriptions** | ✅ | ✗ | ✗ |
| **Add / Edit / Delete Own Data** | ✅ | ✗ | ✗ |
| **Export Own Data as CSV** | ✅ | ✗ | ✗ |
| **View Platform-Wide Analytics** | ✗ | ✅ (Read-Only) | ✅ |
| **View Live System Logs** | ✗ | ✅ | ✅ |
| **Manage User Roles (RBAC)** | ✗ | ✗ | ✅ |
| **Suspend / Reinstate Accounts** | ✗ | ✗ | ✅ |
| **Force Password Reset** | ✗ | ✗ | ✅ |
| **View Any User's Subscriptions** | ✗ | ✗ | ✅ |
| **Delete Any User** | ✗ | ✗ | ✅ |
| **View Global MRR** | ✗ | ✗ | ✅ |
| **Toggle Maintenance Mode** | ✗ | ✗ | ✅ |
| **Export Global Audit Log CSV** | ✗ | ✗ | ✅ |
| **Toggle Light/Dark Theme** | ✅ | ✅ | ✅ |

---

## 👑 Role 1 — Admin Dashboard

### Credentials

| Field | Value |
| :--- | :--- |
| **Email** | `shasankshah.25.mca@iite.indusuni.ac.in` |
| **Password** | `Sh@$ank0110` |

> [!NOTE]
> **How Auto-Seeding Works:** When the server boots, `seedAdmin.js` checks if this master email exists in the database. If not, it hashes the password with `bcrypt` (12 salt rounds) and creates the Admin account automatically. **You never need to manually create it.** This works even when running on the in-memory fallback database.

### Steps to Access

1. Open `http://localhost:5173` in your browser.
2. Click **"Log In"** in the top-right navigation.
3. Enter the credentials above and click **"Sign In"**.
4. The backend recognizes the master email, sets `role: 'Admin'`, generates a JWT, and the frontend's RBAC router immediately redirects you to `/admin-dashboard`.

### What You'll See

- **Platform KPIs** — Total users, total subscriptions, suspended accounts, active subscriptions.
- **Global MRR Widget** — Real-time monthly recurring revenue calculated from all active subscriptions across all users.
- **Top Tracked Service** — The #1 most-subscribed service platform-wide (MongoDB aggregation pipeline).
- **Platform Controls** — Maintenance Mode toggle + Export Audit Log button.
- **User Management Table** — Full RBAC table with an action menu per user (`⋯` button).

---

## 🔬 Role 2 — System Analyst Dashboard

> [!IMPORTANT]
> New accounts are always created as **'User'** by default. An **Admin must promote** an account to 'System Analyst'. Follow the steps below.

### Steps to Access

**Part A — Create the Analyst Account:**
1. Click **"Sign Up"** and create a new account:
   - **Name:** `Test Analyst`
   - **Email:** `analyst@test.com`
   - **Password:** `AnalystPass!123`
2. After registration, immediately **log out** by clicking your avatar (top-right) → **"Logout"**.

**Part B — Promote the Account (as Admin):**
1. Log back in using the **Master Admin credentials** above.
2. In the Admin Dashboard, scroll to the **"User Management & RBAC"** table.
3. Find the `analyst@test.com` row.
4. Click the role `<select>` dropdown on that row and change it from `User` → **`System Analyst`**.
5. A toast notification confirms: `✅ Role updated to System Analyst`.
6. Log out.

**Part C — Log In as the Analyst:**
1. Log in with `analyst@test.com` / `AnalystPass!123`.
2. The frontend RBAC router reads the role from the JWT and routes you to `/analyst-dashboard`.

### What You'll See (Read-Only Enforcement)

- **Platform Analytics Charts** (Recharts) — Category breakdown, user growth, subscription volume.
- **Live System Log Feed** — Simulated real-time activity events.
- **Zero destructive controls** — No add, edit, delete, suspend, or role-change buttons anywhere on this page.

---

## 👤 Role 3 — Standard User Dashboard

### Steps to Access

1. Click **"Sign Up"** and create any new account:
   - **Name:** `Test User`
   - **Email:** `user@test.com`
   - **Password:** `UserPass!123`
2. New accounts default to `role: 'User'` automatically.
3. You are routed to `/dashboard`.

### What You Can Test

- **Add a subscription** — Click "Add Subscription" and fill in service name, cost, billing cycle, and renewal date.
- **Edit and delete** your own subscriptions.
- **Export to CSV** — Your personal subscription list as a `.csv` file.
- **Analytics** — Your own spending breakdown charts.
- **Trial Hub** — Track free trials before they auto-convert.

---

## 🧪 Advanced Feature Testing

### Test: Account Suspension

> [!CAUTION]
> **Do not suspend `shasankshah.25.mca@iite.indusuni.ac.in`** — the backend protects this account, but testing it wastes your time. Use a test account instead.

1. Log in as **Admin**.
2. In the User Management table, find `user@test.com`.
3. Click the **`⋯` kebab button** at the end of that row.
4. Select **🔒 Suspend Account**.
5. **Expected result:** The row dims to `opacity-60`. The status badge turns red: `🔒 Suspended`.
6. Click `⋯` again → **🔓 Reinstate Account** to reverse it.

```
Endpoint: PUT /api/admin/users/:id/suspend
Auth:     Admin JWT (HttpOnly cookie)
Effect:   Toggles User.isSuspended in MongoDB
```

---

### Test: Force Password Reset

1. Log in as **Admin**.
2. Click `⋯` on any user row → **🔑 Force Password Reset**.
3. **Expected result:** Toast appears: `✅ Password reset email sent to user@test.com (simulated)`. An amber `🔑 Reset Pending` badge appears under the user's role badge in the table.

> **Note:** In a production deployment, this would trigger a real email via SendGrid or Nodemailer. The `passwordResetRequested: true` flag is persisted to the database and is ready to integrate.

---

### Test: Maintenance Mode Toggle

1. Log in as **Admin**.
2. Scroll to the **"Platform Controls"** section.
3. Click the animated toggle switch next to **"Maintenance Mode"**.
4. **Expected result:** The switch turns red. The label reads: `🔴 Active — non-admin users are locked out`. A toast fires: `⚠️ Maintenance mode ENABLED`.
5. Toggle it off — it returns to `🟢 Inactive — platform is fully operational`.

---

### Test: Export Global Audit Log

1. Log in as **Admin**.
2. Click **"Export Audit Log"** (top-right of the admin page header).
3. **Expected result:** A file named `STArt_GlobalAuditLog_YYYY-MM-DD.csv` is downloaded to your machine. It contains all users, their roles, suspension status, join date, and platform health metrics.

---

### Test: URL Interception (Security Check)

1. Log in as a standard **User** (`user@test.com`).
2. Manually type `http://localhost:5173/admin-dashboard` in the browser URL bar and press Enter.
3. **Expected result:** The React route guard (`<ProtectedRoute allowedRoles={['Admin']}>`) intercepts the request and immediately redirects you back to `/dashboard`. The admin page **never renders**.

---

## 🔄 Theme Toggle Testing

The animated theme toggle is located in the **top header bar**, between the Currency Selector and the Avatar.

1. Click the **Sun ☀️ icon** (in light mode) to switch to **Dark Mode**.
   - The Sun icon rotates 90° and shrinks away.
   - The Moon icon rotates in from -90° and grows to full size.
   - The entire UI transitions backgrounds, cards, borders, and text over **300–500ms** — no jarring flash.
2. Click the **Moon 🌙 icon** to switch back to **Light Mode**.
3. **Refresh the page** — your preference is saved in `localStorage` and the correct mode loads instantly without any white flash.

---

## 🗄️ Database Fallback Testing

> [!TIP]
> You can test the in-memory fallback without even having MongoDB installed.

1. **Stop your local MongoDB service** (or simply don't start it).
2. Start the backend: `node server.js` from `/backend`.
3. **Watch the console output:**

```
🔌 Connecting to primary MongoDB...
⚠️  Primary DB offline. Starting in-memory fallback...
✅ In-Memory MongoDB started at: mongodb://127.0.0.1:XXXXX/start-tracker
🌱 Seeding admin accounts...
✅ Master Admin seeded: shasankshah.25.mca@iite.indusuni.ac.in
🚀 STArt API is running on http://localhost:5000
```

4. The application is **fully functional** — all routes, auth, and data operations work exactly as normal.
5. **Note:** In-memory data is volatile — it resets when the server restarts (by design, for development safety).

---

<div align="center">

*For questions about the codebase, architecture decisions, or implementation details — refer to [`README.md`](../README.md) or contact the Lead Developer.*

*MCA Program · IITE, Indus University · 2025–26*

</div>
