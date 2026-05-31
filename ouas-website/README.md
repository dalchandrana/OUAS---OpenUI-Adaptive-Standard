# OpenUI Adaptive Standard (OUAS) Website

This repository contains the marketing and documentation website for the OpenUI Adaptive Standard (OUAS), isolated from the core monorepo.

## Tech Stack
- Next.js 14+ (App Router)
- Tailwind CSS v4
- Framer Motion
- MDX & Shiki (for Documentation)

## Getting Started

1. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Run the development server:**
   \`\`\`bash
   npm run dev
   \`\`\`

3. **Open the browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the result.

## Structure
- \`/app\`: Main application routes (Home, Demo, Blog)
- \`/app/docs\`: MDX-powered documentation site
- \`/components\`: Reusable UI components (dark-themed, Dodo Payments inspired)
- \`/lib\`: Utility functions and navigation configurations

## Scripts
- \`npm run build\`: Builds the production-ready Next.js application.
- \`npm run start\`: Starts the production server.
- \`npm run lint\`: Lints the codebase using ESLint.
