# Release Checklist Tool

A modern web application to help developers manage their release process with a simple, intuitive checklist interface.

## Features

- 📋 **Manage Releases**: Create and track multiple releases
- ✅ **Step Tracking**: Monitor progress through 10 predefined release steps
- 📊 **Auto Status**: Automatic status computation (planned → ongoing → done)
- 💾 **Persistent Storage**: Data saved in PostgreSQL database
- 🎨 **Simple UI**: Clean, responsive interface built with Next.js

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Styling**: Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL database

### Installation

1. Clone the repository
```bash
git clone <repo-url>
cd release-checklist
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```

Then edit `.env.local` with your PostgreSQL database URL:
```
DATABASE_URL="postgresql://user:password@localhost:5432/release_checklist"
```

Database setup options:
- **Local**: `postgresql://user:password@localhost:5432/release_checklist`
- **Supabase**: Copy the connection string from your Supabase project

4. Set up the database
```bash
npx prisma migrate dev --name init
```

5. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Viewing Releases
The main page displays all your releases with their current status (planned, ongoing, or done) and progress bars.

### Creating a Release
1. Click "New Release" button
2. Enter release name (e.g., "v2.1.0")
3. Select target date
4. Optionally add additional information
5. Click "Create"

### Managing Steps
1. Click on a release card to expand it
2. Check/uncheck the 10 release steps:
   - Planning & Requirements
   - Code Review
   - Testing
   - Documentation
   - Security Audit
   - Performance Testing
   - Staging Deployment
   - User Acceptance Testing
   - Production Deployment
   - Monitoring & Rollout

### Editing Release Info
1. Expand a release card
2. Click on the "Additional Info" section
3. Edit the text and click "Save"

### Deleting a Release
1. Expand a release card
2. Click "Delete Release"
3. Confirm the deletion

## API Endpoints

- `GET /api/releases` - List all releases
- `POST /api/releases` - Create a new release
- `GET /api/releases/[id]` - Get a specific release
- `PATCH /api/releases/[id]` - Update release additional info
- `DELETE /api/releases/[id]` - Delete a release
- `PATCH /api/releases/[id]/steps/[stepIndex]` - Toggle step completion

## Project Structure

```
release-checklist/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/
│   │   ├── api/               # API routes
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Main page
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   ├── ReleaseCard.tsx    # Release display component
│   │   └── CreateReleaseModal.tsx
│   ├── lib/
│   │   ├── db.ts              # Prisma client
│   │   ├── constants.ts       # Predefined steps
│   │   └── utils.ts           # Utility functions
│   └── types/
│       └── index.ts           # TypeScript types
├── public/                    # Static assets
├── .env.example               # Environment template
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

## Development

### Build for production
```bash
npm run build
npm start
```

### Prisma Studio (Database GUI)
```bash
npx prisma studio
```

## Deployment

### Deploy to Vercel (Recommended)
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Add New..." → "Project"
4. Select your repository
5. Add `DATABASE_URL` environment variable
6. Click "Deploy"

## Notes

- Single-user application (no authentication required)
- All 10 release steps are predefined and the same for every release
- Release status is automatically computed based on step completion
- Uses PostgreSQL with Prisma ORM for type-safe queries

## License

MIT
