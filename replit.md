# 3DBotics® Website

## Overview

This is a modern, futuristic website for 3DBotics®, an educational technology company focused on 3D Printing, AI, and Robotics. The project is a full-stack TypeScript application featuring a React frontend with a dark "Space Black" glassmorphism design aesthetic, paired with an Express.js backend. It serves as a one-page landing site with sections for company information, programs, TechDojo learning portal access (student/franchisee login portals), and contact functionality.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **Styling**: Tailwind CSS with custom CSS variables for brand colors
- **UI Components**: shadcn/ui component library (New York style) with Radix UI primitives
- **State Management**: TanStack React Query for server state
- **Build Tool**: Vite with hot module replacement

### Design System
- **Theme**: Dark mode only with "Space Black" (#0a0a0a) background
- **Brand Colors**: Teal (#5EC4C6), Red (#E8755E), Lime Green (#B5D333) extracted from logo
- **Visual Effects**: Glassmorphism with backdrop blur, semi-transparent cards with lime green borders
- **Typography**: Space Grotesk and Inter fonts

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with tsx for development
- **API Style**: RESTful JSON endpoints under `/api` prefix
- **Session Management**: In-memory storage (MemStorage class) for development; PostgreSQL-ready via connect-pg-simple

### Database Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts`
- **Validation**: Zod schemas with drizzle-zod integration
- **Current Tables**: Users table with UUID primary keys

### Project Structure
```
client/           # React frontend
  src/
    components/ui/  # shadcn/ui components
    pages/          # Route components
    hooks/          # Custom React hooks
    lib/            # Utilities and query client
server/           # Express backend
  index.ts          # Entry point with middleware
  routes.ts         # API route definitions
  storage.ts        # Data access layer
  static.ts         # Production static file serving
  vite.ts           # Development Vite integration
shared/           # Shared code between client/server
  schema.ts         # Database schema and Zod validators
```

### Build System
- **Development**: Vite dev server with Express backend integration
- **Production**: esbuild bundles server, Vite builds client to `dist/public`
- **Scripts**: `npm run dev` for development, `npm run build` + `npm start` for production

## External Dependencies

### Database
- **PostgreSQL**: Required for production (DATABASE_URL environment variable)
- **Drizzle Kit**: Database migrations via `npm run db:push`

### Key NPM Packages
- **Frontend**: React, Wouter, TanStack Query, Tailwind CSS, Radix UI primitives
- **Backend**: Express, Drizzle ORM, Zod, connect-pg-simple
- **Icons**: Lucide React, react-icons (social media icons)

### Replit-Specific Integrations
- **@replit/vite-plugin-runtime-error-modal**: Error overlay in development
- **@replit/vite-plugin-cartographer**: Development tooling
- **@replit/vite-plugin-dev-banner**: Development environment indicator

### Assets
- Brand logo stored in `attached_assets/` directory, aliased as `@assets` in Vite
- Robot face logo used in navigation, hero section, and as chatbot avatar
- Design guidelines documented in `design_guidelines.md`

## API Endpoints
- `POST /api/contact` - Submit contact form (name, email, message) → stores message and returns success
- `POST /api/chat` - Chatbot message endpoint → returns intelligent keyword-based responses

## Recent Updates (December 2025)
- Implemented complete one-page layout with all sections: Navigation, Hero, About, Programs, TechDojo Portal, Testimonials, Contact, Footer
- Added floating AI chatbot with robot face avatar and intelligent responses
- Applied glassmorphism design with Space Black background and brand color accents
- TechDojo Portal features Student Login (Red theme) and Franchisee Login (Teal theme)
- Fixed dynamic Tailwind class issue by using explicit class mappings for brand colors
- Programs section displays cards with unique border colors per program type