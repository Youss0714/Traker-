# Business Management Application

## Project Overview
This is a full-stack business management application built with React, Express.js, and PostgreSQL. The application provides inventory management, client management, sales tracking, and invoicing capabilities.

## Current State
- Successfully running in standard Replit environment
- PostgreSQL database fully operational with all schemas
- Complete frontend and backend implementation working
- Unified invoice system with automatic company branding
- All core features functional: inventory, clients, sales, invoicing

## Recent Changes
- July 22, 2025: Successfully migrated from Replit Agent to Replit environment
- Established PostgreSQL database connection with all required tables
- Implemented unified invoice header system (CompanyInvoiceHeader)
- Added logo_url and slogan columns to company table
- Unified invoice display across Sales module, New Sale form, and print functionality
- All invoice contexts now automatically display company branding

## Architecture
- **Frontend**: React with TypeScript, Vite, TailwindCSS, shadcn/ui components
- **Backend**: Express.js with TypeScript, Drizzle ORM
- **Database**: PostgreSQL with connection pooling
- **Styling**: TailwindCSS with dark/light theme support
- **State Management**: TanStack Query for server state
- **Routing**: Wouter for frontend routing

## Key Features
- User authentication and authorization
- Product/inventory management
- Client management with statistics
- Sales tracking and reporting
- Invoice generation and management
- Company profile setup
- Category management
- PWA capabilities with offline support

## User Preferences
- Prefer comprehensive solutions over incremental updates
- Focus on security and proper client/server separation
- Maintain existing functionality while improving stability

## Security Considerations
- Proper authentication flow with session management
- Input validation using Zod schemas
- SQL injection prevention through Drizzle ORM
- Environment variable protection for database credentials