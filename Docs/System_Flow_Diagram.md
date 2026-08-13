# System Flow Diagram: STArt (Subscription Tracking Application)

This diagram outlines the complete flow of the Progressive Web Application (PWA), capturing authentication, Role-Based Access Control (RBAC) routing, client-side interactions, and backend data processing.

```mermaid
flowchart TD
    %% Define Styles
    classDef client fill:#0f172a,stroke:#06b6d4,stroke-width:2px,color:#fff
    classDef server fill:#020617,stroke:#10b981,stroke-width:2px,color:#fff
    classDef db fill:#064e3b,stroke:#34d399,stroke-width:2px,color:#fff
    classDef auth fill:#1e1b4b,stroke:#8b5cf6,stroke-width:2px,color:#fff

    %% Client Layer (Frontend)
    subgraph Frontend ["Frontend (React + Vite + Tailwind)"]
        Landing[Landing Page / Route: '/']
        AuthModal[Auth Modal / Registration & Login]
        
        Landing --> |User Clicks Login| AuthModal
        
        %% RBAC Routing
        Router{RBAC Router}
        AuthModal --> |Validates JWT Context| Router
        
        Router --> |Role: Admin| AdminDash[Admin Dashboard\n/admin-dashboard]
        Router --> |Role: System Analyst| AnalystDash[Analyst Dashboard\n/analyst-dashboard]
        Router --> |Role: User| UserDash[User Dashboard\n/dashboard]
        
        UserDash --> CRUD[CRUD Interactions:\nAdd, Edit, Delete, Export CSV]
        AdminDash --> GlobalView[Global Platform Metrics]
        AnalystDash --> ReadOnlyView[System Health & Logs]
    end

    %% Backend Layer (Express API)
    subgraph Backend ["Backend API (Node.js + Express)"]
        API_Auth[POST /api/auth\nLogin, Register, Logout]
        API_Subs[GET, POST, PUT, DELETE\n/api/subscriptions]
        
        AuthModal ===> |"Credentials (JSON)"| API_Auth
        CRUD ===> |"JWT HttpOnly Cookie\nData Payload"| API_Subs
    end

    %% Database Layer (MongoDB)
    subgraph Database ["Database (MongoDB)"]
        UserCollection[(Users Collection)]
        SubCollection[(Subscriptions Collection)]
        
        API_Auth <==> |"Bcrypt Hash / Fetch User"| UserCollection
        API_Subs <==> |"Store / Update Data"| SubCollection
    end

    %% Apply Styles
    class Landing,AdminDash,AnalystDash,UserDash,CRUD,GlobalView,ReadOnlyView client;
    class API_Auth,API_Subs server;
    class UserCollection,SubCollection db;
    class AuthModal,Router auth;
```
