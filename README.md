# Collabora

Collabora is a crowdsourced event planning platform designed to foster collaboration, transparency, and trust between Creators and Users, who can participate as Investors or Panitia. Creators can design events, set detailed budgets with task-based breakdowns, and track funding progress in real-time, while Users engage by contributing funds or volunteering and interacting via live chat. A reputation system, driven by event outcomes and participant ratings, ensures accountability and promotes high-quality event execution. Built with modern technologies, Collabora delivers a secure, intuitive, and interactive experience for organizing impactful events through a user-friendly web interface and a robust content management system.

## 🔑 Key Features

### 1. User Roles

- **Creator**: Creates and manages events, sets budgets, and oversees execution.
- **User**: Participates as an Investor (funds events) or Panitia (volunteers for event tasks, subject to Creator approval).

### 2. Event Management

- **Create Event**: Define title, description, location, start/end date, start/end time, event type, status, and funding target.
- **Budget Details**: Task-based budget structure with main tasks and subtasks, including costs.
- **Funding Target & Progress**: Real-time tracking of funding contributions.
- **Gallery and Files**: Upload event photos and documents for transparency.

### 3. Participation

- **Join**: Users join events as Investors (via funding) or Panitia (via volunteer application).
- **Approval System**: Panitia applications are approved by Creators.
- **Chat/Group Discussion**: Real-time chat for event-related communication.

### 4. Rating & Reputation

- **Rating**: Users rate Creators after events with scores and comments.
- **Statistics**: Creator profiles display total ratings, number of events created, and funds raised.

### 5. Security & Verification

- **Transaction Tracking**: Transparent tracking of funding and top-up transactions.
- **Event Proof**: Creators upload gallery images and documents as proof of execution.

## 🛠️ Technology Stack

### Full-Stack

- **Next.js (TypeScript)**: Full-stack framework for responsive, SEO-optimized UI with Server-Side Rendering (SSR), Static Site Generation (SSG), and API Routes for backend logic.
- **MongoDB**: NoSQL database for storing event, user, transaction, and task data.
- **MongoDB Driver**: Direct MongoDB queries without Mongoose for schema management.
- **Socket.IO**: Real-time communication for chat and funding progress updates.
- **Midtrans**: Payment gateway for processing funding contributions and top-ups.
- **Cloudinary**: Cloud storage for event photos and documents.
- **NextAuth.js**: Authentication for email and Google OAuth.
- **Tailwind CSS**: Fast and responsive styling.
- **Shadcn UI**: Reusable UI components for forms, cards, modals, and budget breakdowns.
- **Axios**: HTTP requests for external API integrations.

### Optional

- **Firebase/Supabase**: Real-time data and additional authentication.
- **Payment Gateway**: Xendit or Stripe as alternatives to Midtrans.

## 🔁 User Flow

1. **Public Access (No Login)**: Users browse events on the landing page, view details (title, description, location, funding progress), and explore event galleries.
2. **Registration/Login**: Sign up or log in via email or Google (NextAuth.js), choose role as Creator or User (Investor or Panitia).
3. **Event Creation & Management**: Creators create events, specify details (title, location, dates, type), and set budgets with task-based breakdowns stored in `workbooks` and `tasks`.
4. **Participation**: Users as Investors contribute funds via Midtrans, recorded in `funding` and `transactions`. Users as Panitia apply to assist, recorded in `userevents`, with Creator approval. Funding progress updates in real-time via Socket.IO, and Users communicate via `chats`.
5. **Execution & Documentation**: Creators upload proof (photos, documents) via Cloudinary, stored in `events.gallery` and `events.documents`.
6. **Rating & Reputation**: Investors rate Creators via `ratings` (score, comment), and reputation stats (totalRating, totalUserRating) are displayed on Creator profiles in `users`.
7. **CMS Management**: Creators manage events, approve Panitia (`userevents`), and moderate content (documents, chats) via a dashboard.

## 📋 Minimum Viable Product (MVP)

1. Login
2. Register
3. Create Event
4. Execute Event/Cancel
5. Funding Contribution
6. Invite Panitia (Private/Open Public)
7. Event Chat
8. Top-Up Wallet
9. Auto Cancel Event & Refund
10. Join Event
11. Rate Event

## 🌐 Web Platform

- **Description**: The platform’s foundation with a responsive interface using Next.js and Tailwind CSS. Provides landing page (`app/page.tsx`), event browsing (`/events`), authentication (NextAuth.js), live chat (Socket.IO), and funding tracking.
- **Features**:
  - Landing page with event highlights and CTA, built with Next.js Server Components.
  - Event browsing with filters (type, location) using API Routes (`/api/events`).
  - SEO with Server-Side Rendering (SSR) and Static Site Generation (SSG).
- **User Flow Position**: Step 1 - Public Access.

## 👥 User Roles & Participation

- **Description**: Users register/login to select roles (Creator or User). Investors fund events via Midtrans, Panitia apply to assist, and funding progress updates in real-time.
- **Features**:
  - Registration/login forms at `/login` and `/register` using NextAuth.js.
  - Funding form with Midtrans Snap.js, integrated via API Routes, stored in `funding` and `transactions`.
  - Panitia application form with Creator approval, stored in `userevents`.
  - Real-time chat updates with Socket.IO, stored in `chats`.
- **User Flow Position**: Steps 2 & 4 - Registration/Login & Participation.

## 📅 Event Creation & Management

- **Description**: Creators create events with details (title, location, dates, type) and task-based budgets via `workbooks` and `tasks`. Public can view event details and funding progress.
- **Features**:
  - Event creation form at `/events/create` with input fields and budget setup.
  - Budget structure with main tasks and subtasks (`tasks.workbookId`, `tasks.parentTask`), stored in MongoDB.
  - Public event page at `/events/[id]` with SSR for SEO.
- **User Flow Position**: Step 3 - Event Creation & Management.

## ⭐ Reputation & Documentation

- **Description**: Investors rate Creators (1-5 scale) via `ratings`, Creators upload execution proof via Cloudinary (`events.gallery`, `events.documents`), and reputation stats are displayed on profiles.
- **Features**:
  - Rating and comment form with database transactions (`ratings.eventId`, `ratings.userId`).
  - Document upload via Cloudinary, stored in `events`.
  - Creator profile at `/profile/[id]` with stats (`users.totalRating`, `users.totalUserRating`).
- **User Flow Position**: Steps 5 & 6 - Execution & Documentation, Rating & Reputation.

## 🛠️ Content Management System (CMS)

- **Description**: Dashboard for Creators to manage events, approve Panitia (`userevents`), and moderate content (`chats`, `events.documents`), built with Next.js Admin Dashboard.
- **Features**:
  - Creator dashboard at `/admin` with CRUD operations for events and users.
  - Moderation forms for Panitia approvals and document verification.
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
