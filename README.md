# 🔖 Smart Bookmark App

A simple, minimalist, and private bookmark manager built with Next.js, Supabase, and Tailwind CSS.

## ✨ Features

- 🔐 **Google OAuth** - Secure login via Google.
- ⚡ **Real-time Sync** - Bookmarks update instantly across all open tabs.
- 🔒 **Private** - Your bookmarks are yours alone.
- 🎨 **Minimalist Design** - A clean, simple interface focused on usability.
- 📱 **Responsive** - Works on any device.
- 🗑️ **Delete** - Easily remove bookmarks you no longer need.

## 🛠️ Tech Stack

- **Next.js** (App Router)
- **Supabase** (Auth, Database, Realtime)
- **Tailwind CSS** (Styling)
- **TypeScript**

## 📦 Getting Started

### 1. Prerequisites
- Node.js 18+
- Supabase Account
- Google Cloud Project (for OAuth)

### 2. Setup
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Database Setup
Run the SQL in `schema.sql` in your Supabase SQL editor to create the `bookmarks` table and enable RLS/Realtime.

### 5. Run
```bash
npm run dev
```

## 🚢 Deployment

Deploy directly to **Vercel** and ensure you update your `NEXT_PUBLIC_SITE_URL` and Google OAuth redirect URIs in the Supabase/Google dashboard.

---
Made with ❤️
