
## Getting Started

add .env and add variable JWT_SECRET and value(add whatever you want)'

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
## File Structure
/src
├── /pages
│   ├── /api
│   │   ├── /auth
│   │   │   ├── login.ts
│   │   │   └── register.ts
│   │   ├── /boards
│   │   │   ├── index.ts       // GET all, POST new board
│   │   │   └── [id].ts        // GET, PUT, DELETE a single board
│   │   ├── /tasks
│   │   │   ├── index.ts       // GET all tasks (for a board), POST task
│   │   │   └── [id].ts        // GET, PUT, DELETE a task
│   ├── _app.tsx               // Global wrapper + Tailwind CSS import
│   ├── login.tsx              // Login form
│   ├── register.tsx           // Registration form
│   ├── dashboard.tsx          // Protected page for listing boards
│   └── board/[id].tsx         // Tasks within a board (e.g., Work, Grocery)
│
├── /components
│   ├── BoardCard.tsx          // UI for showing board tiles
│   ├── TaskCard.tsx           // UI for each task
│   └── Navbar.tsx             // Logged-in navbar
│
├── /lib
│   ├── auth.ts                // JWT verify/generate, getUserFromRequest()
│   └── db.ts                  // JSON object or in-memory data
│
├── /types
│   ├── user.ts                // User type/interface
│   ├── board.ts               // Board type
│   └── task.ts                // Task type
│
└tailwind.config.js
└postcss.config.mjs

---
## LIVE DEMO
    Open for LIVE DEMO[https://5pqr83-3000.csb.app/dashboard] (https://5pqr83-3000.csb.app/dashboard)