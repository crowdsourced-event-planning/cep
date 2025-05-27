# Collabora

Collabora is a crowdsourced event planning platform designed to foster collaboration, transparency, and trust among creators, investors, volunteers, and viewers. Users can create events, set budgets with detailed Notion-style breakdowns, and track funding progress in real-time, while participants can join as donors or volunteers and engage through live chat. With a reputation system based on event success and participant ratings, Collabora ensures accountability and encourages high-quality event execution. Built with modern technologies, it offers a seamless, secure, and interactive experience for organizing impactful events through a user-friendly web interface and a robust content management system.

## 🔑 Key Features

### 1. User Roles

- **Creator**: Creates and manages events.
- **Admin**: Assists in managing event execution.
- **Viewer**: Views public events and their progress.

### 2. Event Management

- **Create Event**: Name, description, location, date, type (music, charity, bazaar, etc.), status (public/private).
- **Budget Details**: Breakdown of expenses (venue rental, artists, security, catering).
- **Funding Target & Progress**: Real-time funding tracking.
- **Gallery and Files**: Supports event documentation.

### 3. Participation

- **Join**: As an investor or volunteer.
- **Approval System**: Automatic or creator-approved.
- **Chat/Group Discussion**: Real-time interaction for events.

### 4. Rating & Reputation

- **Rating**: Participants and public rate creators after events.
- **Success Report**: Evidence of event execution per targets.
- **Statistics**: Number of events created, success rate, total funds raised.

### 5. Security & Verification

- **Identity Verification**: Ensures creator authenticity.
- **Transaction Tracking**: Transparent donation tracking.
- **Event Proof**: Photos, reports, testimonials.

## 🛠️ Technology Stack

### Full-Stack

- **Next.js (TypeScript)**: Full-stack framework for responsive, SEO-optimized UI with Server-Side Rendering (SSR), Static Site Generation (SSG), and API Routes for backend logic.
- **MongoDB**: NoSQL database for storing event, user, and transaction data.
- **Mongoose**: ORM for MongoDB schema management and queries.
- **Socket.IO**: Real-time communication for chat and funding progress updates.
- **Midtrans**: Payment gateway for processing donations.
- **Cloudinary**: Cloud storage for photos and documents.
- **NextAuth.js**: Authentication for email and Google OAuth.
- **Tailwind CSS**: Fast and responsive styling.
- **Shadcn UI**: Reusable UI components for forms, cards, modals, and budget breakdowns.
- **Axios**: HTTP requests for external API integrations.

### Optional

- **Firebase/Supabase**: Real-time data and additional authentication.
- **Payment Gateway**: Midtrans, Xendit, or Stripe.

## 🔁 User Flow

1. **Public Access (No Login)**: Users browse events on the landing page, view details, and funding progress.
2. **Registration/Login**: Sign up/login via email or Google (NextAuth.js), choose role (Creator, Volunteer, Viewer).
3. **Event Creation & Management**: Creators create events, fill in details, and set budgets in a Notion-style format.
4. **Participation**: Viewers donate via Midtrans, Volunteers apply to assist, funding progress updates in real-time.
5. **Execution & Documentation**: Creators upload proof of execution via Cloudinary.
6. **Rating & Reputation**: Participants rate creators, reputation stats displayed on profiles.
7. **CMS Management**: Creators/Admins manage events, roles, and content via dashboard.

## 📋 Minimum Viable Product (MVP)

1. Login
2. Register
3. Create Event
4. Execute Event/Cancel
5. Donation
6. Invite Committee (Private/Open Public)
7. Committee & Public Discussion
8. Topup
9. Auto Cancel Event & Refund Donation
10. Join Event
11. Rate Event

## 🌐 Web Platform

- **Description**: The platform's foundation with a responsive interface using Next.js and Tailwind CSS. Provides landing page (app/page.tsx), event browsing (/events), authentication (NextAuth.js), live chat (Socket.IO), and donation tracking.
- **Features**:
  - Landing page with event highlights and CTA, built with Next.js Server Components.
  - Event browsing with filters (category, location) using API Routes (/api/events).
  - SEO with Server-Side Rendering (SSR) and Static Site Generation (SSG).
- **User Flow Position**: Step 1 - Public Access.

## 👥 User Roles & Participation

- **Description**: Users register/login to select roles (Creator, Investor, Volunteer, Viewer). Investors donate via Midtrans, Volunteers apply to assist, funding progress updates in real-time.
- **Features**:
  - Registration/login forms at /login and /register using NextAuth.js.
  - Donation form with Midtrans Snap.js, integrated via API Routes.
  - Volunteer application form with approval notifications.
  - Real-time updates with Socket.IO.
- **User Flow Position**: Steps 2 & 4 - Registration/Login & Participation.

## 📅 Event Creation & Management

- **Description**: Creators create events with details (name, location, date, etc.) and Notion-style budgets. Public can view event details and funding progress.
- **Features**:
  - Event creation form at /events/create with input fields and budget setup.
  - Budget to-do list with main tasks and sub-tasks, stored in MongoDB.
  - Public event page at /events/[id] with SSR for SEO.
- **User Flow Position**: Step 3 - Event Creation & Management.

## ⭐ Reputation & Documentation

- **Description**: Participants rate creators (1-5 scale), creators upload execution proof via Cloudinary, reputation stats displayed on profiles.
- **Features**:
  - Rating and comment form with database transactions.
  - Document upload via Cloudinary, stored in MongoDB.
  - Creator profile at /profile/[id] with reputation stats.
- **User Flow Position**: Steps 5 & 6 - Execution & Documentation, Rating & Reputation.

## 🛠️ Content Management System (CMS)

- **Description**: Dashboard for Creators/Admins to manage events, user roles, and content, built with Next.js Admin Dashboard. Supports moderation (Volunteer approval, document verification).
- **Features**:
  - Admin dashboard at /admin with CRUD operations for events and users.
  - Moderation forms for approvals and verification.
  - Authorization via NextAuth.js middleware.
- **User Flow Position**: Step 7 - CMS Management.

## 👨‍💻 Team

- Andika Rahmadi Saputra (Instructor, Contributor)
- Fadhal Shulhan
- Resya HasanM
- Kendy Supratowo

## 📁 Files & Documentation

- **GitHub (Frontend & Backend)**: [[Link](https://github.com/crowdsourced-event-planning/cep)]
- **Coda/Kanban**: [[Link](https://coda.io/d/Final-Project-2025-RMT-60-V2_dEnd9ZsSZLH/Team-2_surVlTR3)]
- **Figma/Mockup**: [[Link](https://www.figma.com/design/DvfngDgStIgjyrZcnQ1zYK/Untitled?node-id=0-1&t=Ab2NHWOINi3OKdnu-1)]
- **Screenshot Schema Database**: [[Link](https://app.eraser.io/workspace/uGw4kHsFWT9ICs6hxo5a)]

## 🎓 Graduation Day

- **Presentation**: [Link]
- **Video Presentation**: [Link]
- **Link Deploy Application**: [[Link](https://collabora-henna.vercel.app/)]
- **Logo**: [Link]
- **Screenshot Application**: [Link]
