# Deployment Checklist

Use this checklist before deploying to Vercel:

## Pre-Deployment (Local Testing)

- [ ] Clone/open the repository
- [ ] Run `npm install`
- [ ] Create `.env.local` with Supabase credentials
- [ ] Run `npm run dev`
- [ ] Test Google OAuth login
- [ ] Test adding a bookmark
- [ ] Test real-time updates (open in 2 tabs)
- [ ] Test deleting a bookmark
- [ ] Test logout functionality
- [ ] Run `npm run build` - should complete without errors

## Supabase Setup

- [ ] Create Supabase project at supabase.com
- [ ] Copy Project URL and Anon Key
- [ ] Go to SQL Editor in Supabase
- [ ] Run all SQL from `supabase_setup.sql`
- [ ] Verify bookmarks table exists
- [ ] Verify Row Level Security is enabled
- [ ] Go to Authentication > Providers
- [ ] Enable Google provider

## Google OAuth Setup

- [ ] Create project in Google Cloud Console
- [ ] Create OAuth 2.0 credentials (Web application type)
- [ ] Set Authorized Origins:
  - [ ] http://localhost:3000
  - [ ] https://your-vercel-domain.vercel.app
- [ ] Set Authorized Redirect URIs:
  - [ ] http://localhost:3000/auth/callback
  - [ ] https://your-vercel-domain.vercel.app/auth/callback
- [ ] Copy Client ID and Client Secret
- [ ] Go to Supabase > Authentication > Google provider
- [ ] Paste Client ID and Client Secret
- [ ] Save

## GitHub Setup

- [ ] Create GitHub account if needed
- [ ] Create new public repository
- [ ] Push code to GitHub:
  ```bash
  git add .
  git commit -m "Initial commit: Smart Bookmark App"
  git push origin main
  ```
- [ ] Verify all files are on GitHub

## Vercel Deployment

- [ ] Go to vercel.com
- [ ] Sign in with GitHub
- [ ] Click "New Project"
- [ ] Select your GitHub repository
- [ ] Vercel auto-detects as Next.js
- [ ] Add environment variables:
  - [ ] NEXT_PUBLIC_SUPABASE_URL = your_supabase_url
  - [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY = your_anon_key
- [ ] Click "Deploy"
- [ ] Wait for build to complete (should see green checkmark)
- [ ] Visit your live URL
- [ ] Test all features on live site:
  - [ ] Google login works
  - [ ] Can add bookmarks
  - [ ] Real-time updates work
  - [ ] Can delete bookmarks
  - [ ] Can logout

## Final Verifications

- [ ] Update Google OAuth URIs with final Vercel domain if needed
- [ ] Test on mobile browser
- [ ] Test on different browser
- [ ] Share live URL with reviewers
- [ ] Submit link to GitHub repo
- [ ] Provide README.md with setup instructions
- [ ] Include PROBLEMS_AND_SOLUTIONS.md

## Common Issues to Check

If Google OAuth doesn't work:
- [ ] Verify redirect URIs exactly match in Google Cloud and Supabase
- [ ] Check that Google provider is enabled in Supabase
- [ ] Clear browser cookies and cache
- [ ] Try in incognito window

If bookmarks don't appear:
- [ ] Check browser console for errors (F12)
- [ ] Verify you're logged in
- [ ] Check Supabase database has bookmarks table
- [ ] Verify RLS policies are created

If real-time updates don't work:
- [ ] Check Supabase Realtime is enabled
- [ ] Check browser console for subscription errors
- [ ] Verify bookmarks table has RLS enabled
- [ ] Try hard refresh (Ctrl+Shift+R)

## Submission Requirements

For interview submission, ensure you have:

✅ Live Vercel URL (working and tested)
✅ Public GitHub repository
✅ README.md with:
   - Feature overview
   - Tech stack
   - Setup instructions
   - Deployment steps
   - Troubleshooting guide
✅ PROBLEMS_AND_SOLUTIONS.md with:
   - Challenges faced
   - How each was solved
   - Architecture decisions
   - Security measures

## Performance Notes

Current app includes:
- ✅ Real-time updates (Supabase Realtime)
- ✅ Private bookmarks (Row Level Security)
- ✅ Secure authentication (Google OAuth)
- ✅ TypeScript type safety
- ✅ Responsive design (Tailwind CSS)
- ✅ Optimized build (Next.js)

Build output shows:
```
○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
```

This is optimal for Next.js apps.

## Estimated Time

- Setup Supabase: 5 minutes
- Setup Google OAuth: 10 minutes
- Test locally: 5 minutes
- Deploy to Vercel: 2 minutes
- Total: ~22 minutes

---

**Status:** Ready to deploy!

For more details, see README.md and PROBLEMS_AND_SOLUTIONS.md
