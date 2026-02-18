# Smart Bookmark App

A modern, real-time bookmark manager built with Next.js, Supabase, and Tailwind CSS. Users can sign in with Google, save bookmarks, and see updates instantly across all tabs without page refresh.

## Live Demo

**Deployed on Vercel:** https://bookmark-app-neon-tau.vercel.app

## Features

✅ **Google OAuth Authentication** - Sign in securely with your Google account  
✅ **Add & Delete Bookmarks** - Manage your bookmarks easily with title and URL  
✅ **Real-time Synchronization** - Changes appear instantly across all tabs (no refresh needed)  
✅ **Private Bookmarks** - Row Level Security ensures each user only sees their own bookmarks  
✅ **Responsive Design** - Works seamlessly on desktop, tablet, and mobile  
✅ **Production Ready** - Deployed on Vercel with TypeScript type safety  


## How to Run the Project

### Step 1: Clone the Repository

```bash
git clone https://github.com/Karthik-sherigar/Bookmark-App.git
cd Bookmark-App
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages from `package.json`.

### Step 3: Create Database Schema

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **SQL Editor** → **New Query**
4. Copy all SQL from `supabase_setup.sql` file
5. Paste and execute
6. This creates the `bookmarks` table with Row Level Security policies

### Step 4: Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Where to find these:**
- Go to Supabase Dashboard
- Select your project
- **Settings** → **API** → Copy **Project URL** and **Anon Key**

### Step 5: Set Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. **APIs & Services** → **Credentials**
4. Click **+ Create Credentials** → **OAuth 2.0 Client IDs**
5. Configure OAuth consent screen if prompted
6. Choose **Web application** type
7. Add authorized URIs:
   ```
   Authorized Origins:
   - http://localhost:3000
   - https://bookmark-app-neon-tau.vercel.app
   
   Authorized Redirect URIs:
   - http://localhost:3000/auth/callback
   - https://bookmark-app-neon-tau.vercel.app/auth/callback
   ```
8. Copy **Client ID** and **Client Secret**
9. Go to Supabase → **Authentication** → **Providers** → **Google**
10. Enable Google provider and paste credentials
11. Click **Save**

### Step 6: Run Locally

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

### Step 7: Build for Production

```bash
npm run build
npm start
```

## How It Works

### Authentication Flow

1. User clicks "Sign in with Google"
2. Redirected to Google login page
3. After authentication, Google redirects to `/auth/callback`
4. Our callback handler exchanges the auth code for a session
5. User is logged in and redirected to `/dashboard`

### Real-time Bookmark Sync

When you view bookmarks:
1. App fetches all bookmarks from database
2. Subscribes to Supabase real-time channel
3. Whenever ANY bookmark changes in the database:
   - Supabase sends a notification to all connected clients
   - Our app automatically reloads the bookmark list
   - All tabs update instantly without page refresh

### User Privacy (Row Level Security)

Each bookmark has a `user_id` field linked to the authenticated user. The database has RLS policies that ensure:
- Users can only **view** their own bookmarks
- Users can only **insert** bookmarks for themselves
- Users can only **delete** their own bookmarks
- Users can only **update** their own bookmarks

This is enforced at the **database level**, not the app level, making it secure.

## Project Structure

```
bookmark/
├── app/                           # Application code
│   ├── auth/
│   │   ├── page.tsx              # Login page with Google button
│   │   └── callback/route.ts     # OAuth callback handler
│   ├── dashboard/page.tsx        # Main app (protected route)
│   ├── components/
│   │   ├── bookmarks.tsx         # Add & list bookmarks
│   │   └── user-profile.tsx      # User info & logout
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Redirect to /auth
│   ├── providers.tsx             # Auth state management
│   └── globals.css               # Global styles
│
├── lib/supabase/
│   ├── client.ts                 # Browser Supabase client
│   └── server.ts                 # Server Supabase client
│
├── public/                        # Static assets
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── next.config.ts                # Next.js config
├── postcss.config.mjs            # PostCSS config
├── supabase_setup.sql            # Database schema
└── .env.local                    # Environment variables
```

## Challenges I Faced & Solutions

### 1. **Learning Next.js While Coding**

I was new to Next.js when starting this project. The App Router concept was unfamiliar to me.

**Solution:** I used AI assistant for system design planning and understanding Next.js patterns. This helped me:
- Understand file-based routing in the `app/` directory
- Learn about client vs server components (`'use client'` directive)
- Implement proper layout structures
- Handle form submissions and redirects

**What I learned:** Next.js abstracts a lot of complexity, making it easier to build full-stack apps without separate backend servers.

### 2. **Hydration Mismatch Error**

When I first ran the app, React threw a hydration mismatch error: "server rendered HTML didn't match client HTML."

**Problem:** The `AuthProvider` component was setting `isLoading = true` on the client side immediately, but the server rendered it as `false`. This caused a mismatch.

**Solution:** I added an `isMounted` flag:
```tsx
const [isMounted, setIsMounted] = useState(false)

useEffect(() => {
  setIsMounted(true)
  // ... auth logic
}, [])

// Only show loading after mounting on client
if (isLoading && isMounted) {
  return <LoadingSpinner />
}
```

This ensures the server and client render the same HTML initially.


### 3. **OAuth Redirect URI Mismatch**

Google OAuth wasn't working on the production Vercel URL.

**Problem:** The redirect URI in Google Cloud Console didn't match what the app expected (`/auth/callback`).

**Solution:** 
- Updated Google Cloud with correct redirect URIs
- Ensured both localhost and Vercel URLs were configured
- Made sure Supabase Google provider was enabled

**Lesson:** OAuth configuration must match EXACTLY across all services (Google Cloud, Supabase, app code).

### 4. **Understanding Real-time with Supabase**

Implementing real-time updates was tricky at first.

**Problem:** I didn't understand how Supabase subscriptions worked.

**Solution:** 
- Studied Supabase documentation with AI assistant guidance
- Used `useEffect` to set up subscriptions
- Ensured cleanup with `unsubscribe()` on unmount
- Tested with 2 browser tabs to verify instant sync

**What I learned:** Real-time is powerful but requires proper subscription management to avoid memory leaks.

## Tools & Assistance

- **AI Assistant:** Used for system design, Next.js patterns, and debugging
- **VS Code:** Code editor with TypeScript support
- **Git:** Version control and GitHub hosting
- **Vercel CLI:** Easy deployment from terminal

## Contact & Feedback

GitHub: [@Karthik-sherigar](https://github.com/Karthik-sherigar)
Website: [Karthik Sherigar](https://karthik-sherigar.onrender.com/)

---

**Built with passion and learning! 🚀**
