+=============================================================================+
|                                                                             |
|                       STArt: TEAM ONBOARDING GUIDE                          |
|                                                                             |
+=============================================================================+

Welcome to the STArt (Subscription Tracking Application) project repository! 
Please follow this setup guide precisely to get your local environment running.

-------------------------------------------------------------------------------
 [STEP 1] REPOSITORY ACCESS
-------------------------------------------------------------------------------
 - Await approval from the repository administrator. 
 - Once you receive your GitHub invitation via email, accept it.

-------------------------------------------------------------------------------
 [STEP 2] CLONING THE REPOSITORY
-------------------------------------------------------------------------------
 - Open GitHub Desktop.
 - Go to File > Clone Repository.
 - Select the 'Subscription-Tracking-Application' repository and click Clone.
 - Alternatively, via CLI:
   git clone https://github.com/ShasankShah01/Subscription-Tracking-Application.git

-------------------------------------------------------------------------------
 [STEP 3] OPENING THE WORKSPACE
-------------------------------------------------------------------------------
 - Open your preferred IDE (e.g., VS Code).
 - Navigate to the cloned folder and open the ROOT workspace directory.
 - Open two separate terminal windows in your IDE (one for frontend, one for backend).

-------------------------------------------------------------------------------
 [STEP 4] RUNNING THE BACKEND (Terminal 1)
-------------------------------------------------------------------------------
 1. Navigate to the backend directory:
    > cd backend
 
 2. Install dependencies:
    > npm install
 
 3. Ensure your local MongoDB instance is running, or create a .env file with your MONGO_URI.
 
 4. Start the backend server:
    > node server.js
 
 -> Expected output: "Server running on port 5000" and "MongoDB Connected"

-------------------------------------------------------------------------------
 [STEP 5] RUNNING THE FRONTEND (Terminal 2)
-------------------------------------------------------------------------------
 1. Navigate to the frontend directory:
    > cd frontend
 
 2. Install dependencies:
    > npm install
 
 3. Start the Vite development server:
    > npm run dev
 
 -> Expected output: "Local: http://localhost:5173/"

-------------------------------------------------------------------------------
 [STEP 6] REGISTRATION & ROLE ASSIGNMENT
-------------------------------------------------------------------------------
 1. Open your browser to http://localhost:5173/
 2. Click "Login / Register" and switch to the "Create Account" tab.
 3. IMPORTANT: Use your actual Name and College Email address.
 4. Choose your appropriate Country from the dropdown.
 5. Create a secure password (must meet complexity requirements).
 6. Once logged in, inform the Master Admin (Shasank Shah) so your account can 
    be manually elevated to the 'System Analyst' role via the database.

+=============================================================================+
|                STArt Project - Developed for IITE, Indus University                |
+=============================================================================+
