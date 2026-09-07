# 🏗️ STArt — System Architecture & Flow Diagrams

> *Visual documentation of the complete request lifecycle, RBAC routing, and database resilience architecture of the STArt Subscription Tracking Application.*

---

## Diagram 1 — Full System Flow (Auth → RBAC → Data Layer)

This diagram traces every user action from the browser to the database and back, including the RBAC role decision tree and the bidirectional data flow through the Express API.

```mermaid
%%{
  init: {
    'theme': 'base',
    'themeVariables': {
      'primaryColor': '#0f172a',
      'primaryTextColor': '#f1f5f9',
      'primaryBorderColor': '#06b6d4',
      'lineColor': '#94a3b8',
      'secondaryColor': '#1e293b',
      'tertiaryColor': '#0B1120',
      'background': '#0B1120',
      'mainBkg': '#0f172a',
      'nodeBorder': '#06b6d4',
      'clusterBkg': '#1e293b',
      'titleColor': '#f1f5f9',
      'edgeLabelBackground': '#1e293b',
      'fontFamily': 'ui-sans-serif, system-ui, sans-serif'
    }
  }
}%%
flowchart TD
    %% ── Node Styles ────────────────────────────────────────────────────────
    classDef client   fill:#0c1a2e,stroke:#06b6d4,stroke-width:2px,color:#e2e8f0,rx:8
    classDef server   fill:#0d1f14,stroke:#10b981,stroke-width:2px,color:#e2e8f0,rx:8
    classDef db       fill:#130d2e,stroke:#8b5cf6,stroke-width:2px,color:#e2e8f0,rx:8
    classDef auth     fill:#1a1030,stroke:#a78bfa,stroke-width:2px,color:#e2e8f0,rx:8
    classDef decision fill:#1a1530,stroke:#f59e0b,stroke-width:2px,color:#fcd34d,rx:8
    classDef fallback fill:#1a0f0f,stroke:#f87171,stroke-width:2px,color:#fca5a5,rx:8

    %% ── Client / Frontend Layer ────────────────────────────────────────────
    subgraph FE ["⚛️  Frontend — React 18 + Vite + Tailwind CSS v4"]
        direction TB
        Landing["🏠 Landing Page\n[ Route: / ]"]
        AuthModal["🔐 Auth Modal\nLogin & Registration"]
        
        RBAC{"🛡️ RBAC Route Guard\nReads JWT role claim"}

        AdminDash["👑 Admin Dashboard\n/admin-dashboard\nMRR · RBAC · Suspend · CSV"]
        AnalystDash["🔬 Analyst Dashboard\n/analyst-dashboard\nRead-Only Charts & Logs"]
        UserDash["👤 User Dashboard\n/dashboard\nPersonal Subscription CRUD"]

        Landing -->|"User clicks Login/Sign Up"| AuthModal
        AuthModal -->|"JWT stored in HttpOnly Cookie"| RBAC

        RBAC -->|"role === 'Admin'"| AdminDash
        RBAC -->|"role === 'System Analyst'"| AnalystDash
        RBAC -->|"role === 'User'"| UserDash
        RBAC -->|"Unauthorized URL attempt"| UserDash
    end

    %% ── Backend / API Layer ────────────────────────────────────────────────
    subgraph BE ["🖥️  Backend — Node.js + Express API"]
        direction TB
        Protect["🔒 protect()\nauthMiddleware.js\nVerifies JWT"]
        Authorize["⚖️ authorize(...roles)\nrbacMiddleware.js\nEnforces role policy"]

        API_Auth["POST /api/auth\nLogin · Register · Logout"]
        API_Subs["CRUD /api/subscriptions\nGet · Add · Edit · Delete"]
        API_Admin["GET/PUT/DELETE /api/admin\nStats · Users · Suspend · Reset"]

        Protect --> Authorize
        Authorize --> API_Admin
    end

    %% ── Database Layer ─────────────────────────────────────────────────────
    subgraph DB ["🗄️  Database Layer — MongoDB + Mongoose"]
        direction LR
        PrimaryDB[("🟢 Primary MongoDB\nmongodb://localhost:27017")]
        FallbackDB[("🔴 In-Memory Fallback\nmongodb-memory-server\nAuto-spun on ECONNREFUSED")]
        
        Users[("👥 Users Collection\nname · email · role\nisSuspended · passwordResetRequested")]
        Subs[("📋 Subscriptions Collection\nserviceName · cost · billingCycle\nnextRenewalDate · status")]

        PrimaryDB -->|"Connected ✅"| Users
        PrimaryDB -->|"Connected ✅"| Subs
        FallbackDB -->|"Fallback Active ⚠️"| Users
        FallbackDB -->|"Fallback Active ⚠️"| Subs
    end

    %% ── Cross-layer connections ─────────────────────────────────────────────
    AuthModal     ===>|"Credentials JSON"| API_Auth
    UserDash      ===>|"JWT Cookie + Payload"| API_Subs
    AdminDash     ===>|"JWT Cookie + Payload"| Protect
    AnalystDash   ===>|"JWT Cookie (read-only)"| Protect

    API_Auth    <-->|"bcrypt hash / fetch user"| Users
    API_Subs    <-->|"store / update data"| Subs
    API_Admin   <-->|"RBAC mutations / aggregation"| Users
    API_Admin   <-->|"MRR calc / TopService"| Subs

    %% ── Apply Styles ───────────────────────────────────────────────────────
    class Landing,AuthModal,AdminDash,AnalystDash,UserDash client
    class API_Auth,API_Subs,API_Admin,Protect,Authorize server
    class Users,Subs,PrimaryDB db
    class FallbackDB fallback
    class RBAC decision
```

---

## Diagram 2 — Database Resilience: Primary → Fallback Boot Sequence

This sequence diagram shows the exact async startup order implemented in `server.js` and `config/db.js`, including the graceful fallback when MongoDB is unreachable.

```mermaid
%%{
  init: {
    'theme': 'base',
    'themeVariables': {
      'primaryColor': '#0f172a',
      'primaryTextColor': '#f1f5f9',
      'primaryBorderColor': '#06b6d4',
      'lineColor': '#94a3b8',
      'background': '#0B1120',
      'actorBkg': '#0f172a',
      'actorBorder': '#06b6d4',
      'actorTextColor': '#e2e8f0',
      'activationBorderColor': '#10b981',
      'activationBkgColor': '#0d1f14',
      'noteBkgColor': '#1e293b',
      'noteTextColor': '#cbd5e1',
      'noteBorderColor': '#475569',
      'fontFamily': 'ui-sans-serif, system-ui, sans-serif'
    }
  }
}%%
sequenceDiagram
    autonumber
    participant S  as 🖥️ server.js
    participant DB as ⚙️ config/db.js
    participant M  as 🟢 MongoDB (Primary)
    participant MMS as 🔴 MongoMemoryServer
    participant Seed as 🌱 seedAdmin.js
    participant API as 🚀 Express App

    S  ->> DB: connectDB()
    activate DB
    DB ->> M: mongoose.connect(MONGO_URI)
    
    alt ✅ Primary Connected
        M -->> DB: Connection established
        DB -->> S: { usingFallback: false }
        Note over DB,M: console.log("✅ Connected to Primary Local MongoDB")
    else ❌ ECONNREFUSED — MongoDB Offline
        M -->> DB: Connection error thrown
        DB ->> MMS: new MongoMemoryServer()
        activate MMS
        MMS -->> DB: Dynamic URI (e.g., mongodb://127.0.0.1:52619)
        DB ->> MMS: mongoose.connect(dynamicURI)
        MMS -->> DB: Connection established
        deactivate MMS
        DB -->> S: { usingFallback: true }
        Note over DB,MMS: console.log("⚠️ Primary DB offline. Running on Fallback In-Memory DB")
    end
    deactivate DB

    S ->> Seed: seedAdmin(usingFallback)
    activate Seed
    Seed ->> M: User.findOne({ email: masterEmail })
    
    alt Admin doesn't exist yet
        Seed ->> Seed: bcrypt.hash(password, 12)
        Seed ->> M: User.create({ role: 'Admin', ... })
        Note over Seed: console.log("✅ Master Admin seeded")
    else Admin already exists
        Note over Seed: console.log("ℹ️ Admin already present, skipping")
    end
    deactivate Seed

    S ->> API: app.listen(PORT)
    API -->> S: Server live on http://localhost:5000
    Note over S,API: console.log("🚀 STArt API is running")
```

---

## Diagram 3 — Admin Action Flow: Suspend / Force-Reset / RBAC Change

This diagram shows the full lifecycle of an admin performing a destructive action from the UI through to the database.

```mermaid
%%{
  init: {
    'theme': 'base',
    'themeVariables': {
      'primaryColor': '#0f172a',
      'primaryTextColor': '#f1f5f9',
      'primaryBorderColor': '#06b6d4',
      'lineColor': '#94a3b8',
      'background': '#0B1120',
      'actorBkg': '#0f172a',
      'actorBorder': '#06b6d4',
      'actorTextColor': '#e2e8f0',
      'noteBkgColor': '#1e293b',
      'noteTextColor': '#cbd5e1',
      'fontFamily': 'ui-sans-serif, system-ui, sans-serif'
    }
  }
}%%
sequenceDiagram
    autonumber
    participant Admin as 👑 Admin (Browser)
    participant UI    as ⚛️ AdminPage.jsx
    participant MW    as 🔒 authMiddleware + rbacMiddleware
    participant Ctrl  as ⚙️ adminController.js
    participant DB    as 🗄️ MongoDB

    Admin ->> UI: Clicks ⋯ → "Suspend Account"
    UI ->> UI: fetch PUT /api/admin/users/:id/suspend
    Note over UI: credentials: 'include' sends HttpOnly JWT cookie

    UI ->> MW: Request arrives at Express router
    activate MW
    MW ->> MW: protect() — verifies JWT signature
    MW ->> MW: authorize('Admin') — checks role claim
    
    alt ✅ Valid Admin JWT
        MW ->> Ctrl: toggleSuspendUser(req, res)
        activate Ctrl
        Ctrl ->> DB: User.findById(id)
        DB -->> Ctrl: User document
        
        alt Target is Master Admin
            Ctrl -->> UI: 403 — Cannot suspend master admin
        else Target is normal user
            Ctrl ->> DB: user.isSuspended = !user.isSuspended → save()
            DB -->> Ctrl: Updated user document
            Ctrl -->> UI: 200 — { isSuspended: true/false, message }
        end
        deactivate Ctrl
        
        UI ->> UI: fetchData() — re-fetch all users
        UI ->> Admin: Toast "✅ Account suspended/reinstated"
        UI ->> Admin: Row badge updates to 🔒 Suspended / active role
        
    else ❌ Invalid or Missing JWT
        MW -->> UI: 401 Unauthorized
        UI ->> Admin: Error toast displayed
    end
    deactivate MW
```

---

## 📐 Component Architecture — Frontend Module Map

```mermaid
%%{
  init: {
    'theme': 'base',
    'themeVariables': {
      'primaryColor': '#0f172a',
      'primaryTextColor': '#f1f5f9',
      'primaryBorderColor': '#06b6d4',
      'lineColor': '#475569',
      'background': '#0B1120',
      'mainBkg': '#0f172a',
      'clusterBkg': '#111827',
      'titleColor': '#e2e8f0',
      'fontFamily': 'ui-sans-serif, system-ui, sans-serif'
    }
  }
}%%
graph LR
    subgraph CTX ["🧠 Context Providers"]
        TC["ThemeContext\n· isDarkMode\n· toggleTheme\n· FOUC prevention"]
        AC["AuthContext\n· user\n· login/logout"]
    end

    subgraph LAY ["📐 Layouts"]
        DL["DashboardLayout\n· Sidebar\n· Header + ThemeToggle\n· Avatar Dropdown\n· Ambient Glows\n· Joyride Tour"]
    end

    subgraph PAGES ["📄 Pages"]
        AP["AdminPage\n· StatCards · MRR Widget\n· Platform Controls\n· UserTable + ActionMenu\n· Modals"]
        ANP["AnalystPage\n· Recharts Charts\n· Live Log Feed\n· Read-Only"]
        UP["DashboardPage\n· DashboardView\n· Subscription CRUD"]
    end

    subgraph COMP ["🧩 Components"]
        TT["ThemeToggle\n· Rotate/scale swap\n· Sun/Moon icons\n· Frosted hover pill"]
        SB["Sidebar\n· Role-aware nav\n· midnight dark bg"]
        CS["CurrencySelector"]
        AM["AddSubscriptionModal"]
        TN["ToastNotification"]
    end

    TC --> DL
    AC --> DL
    DL --> AP
    DL --> ANP
    DL --> UP
    DL --> TT
    DL --> SB
    DL --> CS
    UP --> AM
    UP --> TN
    AP --> TN
```

---

*Last updated: August 2026 · STArt v1.0 · MCA Program, IITE Indus University*
