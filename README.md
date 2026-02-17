# Smart Bookmark App

A real-time bookmark manager built with Next.js, Supabase, and Tailwind CSS.

## Features

- **Google OAuth Authentication** - Secure sign-up and login using Google accounts
- **Add Bookmarks** - Save bookmarks with title and URL
- **Real-time Updates** - Changes appear instantly across all tabs without page refresh
- **Private Bookmarks** - Each user can only see their own bookmarks (enforced with Row Level Security)
- **Delete Bookmarks** - Remove bookmarks you no longer need
- **User Profile** - View your profile information and logout

## Tech Stack

- **Next.js** - React framework with App Router for server-rendered web applications
- **Supabase** - Backend-as-a-Service for authentication, database, and real-time features
- **Tailwind CSS** - Utility-first CSS framework for styling
- **TypeScript** - Type-safe development

## Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier works)
- Google OAuth credentials

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd bookmark
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a new project on [Supabase](https://supabase.com)
2. In your Supabase dashboard, go to SQL Editor
3. Run the queries from `supabase_setup.sql` to create the bookmarks table with Row Level Security policies
4. Enable Google OAuth provider:
   - Go to Authentication > Providers
   - Click Google
   - Add your Google OAuth credentials (from Google Cloud Console)

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Get these values from Supabase Project Settings > API Keys

### 5. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized JavaScript origins: `http://localhost:3000`, `https://yourdomain.com`
   - Authorized redirect URIs: `http://localhost:3000/auth/callback`, `https://yourdomain.com/auth/callback`
5. Copy Client ID and Client Secret to Supabase Google provider settings

## Running the App

### Development

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

### Production Build

```bash
npm run build
npm start
```

## Deployment on Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Deploy to Vercel

1. Go to [Vercel](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click "Deploy"

Update your Google OAuth redirect URIs in Google Cloud Console to include your Vercel domain.

## Project Structure

```
bookmark/
├── app/
│   ├── auth/
│   │   ├── page.tsx          # Login page with Google OAuth
│   │   └── callback/
│   │       └── route.ts      # OAuth callback handler
│   ├── dashboard/
│   │   └── page.tsx          # Main dashboard with bookmarks
│   ├── components/
│   │   ├── bookmarks.tsx     # Bookmark form and list
│   │   └── user-profile.tsx  # User profile display
│   ├── layout.tsx            # Root layout with auth provider
│   ├── page.tsx              # Home page (redirects to auth)
│   ├── globals.css           # Global styles
│   └── providers.tsx         # Auth provider wrapper
├── lib/
│   └── supabase/
│       ├── client.ts         # Client-side Supabase client
│       └── server.ts         # Server-side Supabase client
├── public/                   # Static files
├── .env.local               # Environment variables (not committed)
├── supabase_setup.sql       # Database setup queries
├── next.config.ts           # Next.js configuration
├── tsconfig.json            # TypeScript configuration
├── tailwind.config.ts       # Tailwind CSS configuration
├── postcss.config.mjs       # PostCSS configuration
├── package.json             # Project dependencies
└── README.md                # This file
```

## How It Works

### Authentication Flow

1. User visits the app and is redirected to `/auth`
2. User clicks "Sign in with Google"
3. Supabase handles OAuth with Google
4. After authentication, user is redirected to `/auth/callback`
5. Token is stored in cookies (handled by Supabase)
6. User is redirected to `/dashboard`

### Real-time Updates

The BookmarkList component subscribes to real-time changes on the bookmarks table using Supabase Realtime:

1. When a bookmark is added/deleted in one tab
2. Supabase emits a broadcast event
3. All subscribed clients receive the update
4. Component re-fetches and displays updated list

### Security

- **Row Level Security (RLS)** - Database policies ensure users only access their own bookmarks
- **Auth Tokens** - Stored securely in HttpOnly cookies
- **Type Safety** - TypeScript ensures type-safe database queries

## Troubleshooting

### "NEXT_PUBLIC_SUPABASE_URL is undefined"
- Check `.env.local` file exists with correct values
- Restart development server after changing env variables

### Google OAuth not working
- Verify Google credentials in Supabase Google provider settings
- Check redirect URIs match your deployment domain
- Clear browser cookies and try again

### Real-time updates not showing
- Check browser console for errors
- Verify Row Level Security policies are enabled on bookmarks table
- Check Supabase Realtime is enabled in project settings

### Bookmarks not appearing
- Verify the bookmarks table exists in Supabase
- Check user is authenticated (check auth state in console)
- Verify RLS policies allow SELECT for authenticated users

## Performance Considerations

- Bookmarks load on component mount and subscribe to real-time updates
- Bookmark form clears on successful submit for better UX
- Images lazy loaded where applicable
- CSS purged in production build

## Future Enhancements

- Bookmark categories/tags
- Search and filter functionality
- Bookmark editing
- Export bookmarks
- Import from browser bookmarks
- Sharing bookmarks with other users

## License

This project is open source and available under the MIT License.

## Support

For issues and questions, please open an issue in the GitHub repository.
