# Collabora

Collabora is a modern crowdsourced event planning platform that empowers Creators and Users (Investors & Panitia/Volunteers) to collaborate transparently in organizing impactful events. The platform features real-time funding, task-based budgeting, live chat, and a reputation system to ensure trust and accountability.

## 🚀 Features

- **Role-based System:**

  - **Creator:** Create, manage, and execute events with detailed budgets and documentation.
  - **User:** Join as Investor (fund events) or Committee (volunteer for event tasks, with Creator approval).

- **Event Management:**

  - Create events with title, description, location, schedule, type, and funding target.
  - **AI-powered Description Generator:** Instantly generate an engaging and informative event description by clicking the AI icon next to the description field. The AI will create a description based on your event title.
  - Manage budgets with main tasks and subtasks.
  - Upload event galleries and documents for transparency.

- **Participation & Collaboration:**

  - Investors contribute funds via integrated payment gateway (Xendit).
  - Committee apply to volunteer; Creators approve/reject applications.
  - Real-time chat and group discussion using Socket.IO.

- **Reputation:**

  - Creator profiles display event count and total funds raised.

- **Security & Transparency:**
  - Track all funding and top-up transactions.
  - Creators upload proof of event execution (photos, documents).

## 🛠️ Technology Stack

- **Frontend & Backend:** [Next.js (TypeScript)](https://nextjs.org/)
- **Database:** [MongoDB](https://www.mongodb.com/) (using native MongoDB driver)
- **Real-time:** [Socket.IO](https://socket.io/) for chat and funding updates
- **Authentication:** [NextAuth.js](https://next-auth.js.org/) (Email & Google OAuth)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/)
- **Payment Gateway:** [Midtrans](https://midtrans.com/), [Xendit](https://xendit.co/) (via `xendit-node`)
- **Cloud Storage:** [Cloudinary](https://cloudinary.com/) for images and documents
- **Utilities:** [Axios](https://axios-http.com/), [Zod](https://zod.dev/) for validation, [date-fns](https://date-fns.org/)
- **Other:** [Firebase](https://firebase.google.com/) (optional, for real-time features), [SweetAlert2](https://sweetalert2.github.io/) for alerts

## 📦 Project Structure

- `src/app` — Next.js pages and API routes
- `src/components` — UI components (forms, modals, chat, etc.)
- `src/db/models` — MongoDB data models (without Mongoose)
- `src/lib` — Utilities and external integrations
- `src/types` — TypeScript types and interfaces

## 🔁 User Flow

1. **Browse Events:** Public users can view events, details, and funding progress.
2. **Register/Login:** Users sign up or log in (choose Creator or User role).
3. **Create & Manage Events:** Creators set up events, budgets, and documentation.
   - **Generate Description:** When entering the event title, click the AI icon to automatically generate a suggested description.
4. **Participate:** Investors fund events; Committee apply to volunteer.
5. **Approval:** Creators approve/reject Committee applications.
6. **Execution & Proof:** Creators upload event proof (photos, docs).
7. **Rating:** Investors rate Creators post-event.

## 🧑‍💻 Example API Route

The platform includes AI-powered features, such as generating event descriptions using Google Gemini API:

```typescript
// Example: src/app/api/ai/route.ts
export async function POST(req: NextRequest) {
  // Receives event title, returns an AI-generated description
}
```

## 📝 Scripts

- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm start` — Start production server
- `npm run lint` — Lint codebase

## 👥 Team

- Andika Rahmadi Saputra (Instructor, Contributor)
- Fadhal Shulhan
- Resya HasanM
- Kendy Supratowo

## 📄 Documentation & Links

- **GitHub:** [Frontend & Backend](https://github.com/crowdsourced-event-planning/cep)
- **Kanban:** [Coda Board](https://coda.io/d/Final-Project-2025-RMT-60-V2_dEnd9ZsSZLH/Team-2_surVlTR3)
- **Design:** [Figma Mockup](https://www.figma.com/design/DvfngDgStIgjyrZcnQ1zYK/Untitled?node-id=0-1&t=Ab2NHWOINi3OKdnu-1)
- **Database Schema:** [Eraser](https://app.eraser.io/workspace/uGw4kHsFWT9ICs6hxo5a)
- **Live App:** [collabora-henna.vercel.app](https://collabora-henna.vercel.app/)

---

> For more details, see the codebase and documentation in each folder.
