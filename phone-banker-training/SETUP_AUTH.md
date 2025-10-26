# Authentication Setup Guide

## Quick Setup for Sign Up/Sign In Functionality

### 1. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Choose your organization and enter project details:
   - Name: `grassroots-training` (or any name you prefer)
   - Database Password: Choose a strong password
   - Region: Choose the closest region to your users
5. Click "Create new project"
6. Wait for the project to be set up (usually takes 1-2 minutes)

### 2. Get Your Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

### 3. Set Up Environment Variables

1. In your project root directory, create a file called `.env.local`
2. Add the following content:

```env
# Supabase Configuration (Required for authentication)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Vapi Configuration (Optional - for voice calls)
NEXT_PUBLIC_VAPI_PUBLIC_KEY=your_vapi_public_key_here
```

3. Replace `your-project-id.supabase.co` and `your_anon_key_here` with your actual values from step 2

### 4. Set Up Database Schema

1. In your Supabase project dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy the entire content from `DATABASE_SCHEMA.sql` in this project
4. Paste it into the SQL editor
5. Click "Run" to execute the SQL

This will create all necessary tables, indexes, and security policies for the authentication system.

### 5. Configure Authentication Settings

1. In your Supabase project dashboard, go to **Authentication** → **Settings**
2. Under **Site URL**, add: `http://localhost:3000` (for development)
3. Under **Redirect URLs**, add: `http://localhost:3000/dashboard`
4. (Optional) Enable email confirmation if you want users to verify their email addresses

### 6. Test the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open [http://localhost:3000](http://localhost:3000) in your browser

3. Click "Start Now" or navigate to `/dashboard`

4. You should see the sign up/sign in form

5. Try creating a new account:
   - Enter your email and password
   - Click "Create Account"
   - Check your email for a confirmation link (if email confirmation is enabled)

6. Try signing in with your credentials

### 7. Troubleshooting

**If you see "Supabase not configured" errors:**
- Check that your `.env.local` file exists and has the correct variable names
- Make sure there are no extra spaces or quotes around your values
- Restart your development server after adding environment variables

**If authentication doesn't work:**
- Check the Supabase project dashboard for any error messages
- Verify that the database schema was created successfully
- Check the browser console for any JavaScript errors

**If the UI looks broken:**
- The text should now be black and clearly visible
- Password fields should be properly hidden
- All form elements should have proper styling

### 8. Production Deployment

When deploying to production:

1. Update the **Site URL** in Supabase to your production domain
2. Add your production domain to **Redirect URLs**
3. Set the environment variables in your hosting platform (Vercel, Netlify, etc.)
4. Make sure to use `https://` URLs in production

## What's Fixed

✅ **Environment Configuration**: Added proper Supabase environment variable setup
✅ **UI Visibility**: Fixed text colors to be black and clearly visible
✅ **Password Security**: Ensured password fields are properly hidden
✅ **Form Styling**: Added placeholders and improved input styling
✅ **Authentication Flow**: Complete sign up/sign in functionality is now configured

The authentication system is now fully functional and ready to use!
