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

1. **View Releases**: See all your releases on the main page with their current status
2. **Create Release**: Click "New Release" to add a new release with name, date, and optional notes
3. **Track Steps**: Check off steps as you complete them
4. **Monitor Progress**: Watch the status automatically update as you progress
5. **Edit Notes**: Update additional information for any release

## Project Structure

```
release-checklist/
├── prisma/           # Database schema
├── src/
│   ├── app/          # Next.js pages and API routes
│   ├── components/   # React components
│   ├── lib/          # Utilities and helpers
│   ├── types/        # TypeScript types
│   └── styles/       # CSS files
├── public/           # Static assets
└── README.md
```

## License

MIT
