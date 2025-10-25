# Phone Banker Training Platform - Setup Guide

This guide will walk you through setting up the platform from scratch.

## 📝 Step-by-Step Setup

### Step 1: Install Dependencies

```bash
cd phone-banker-training
npm install
```

### Step 2: Set Up Vapi Account

1. Go to https://dashboard.vapi.ai and sign up for an account
2. Navigate to the "Settings" or "API Keys" section
3. Copy your **Public Key** (it starts with something like `pk_...`)
4. Keep this tab open - you'll need this key in the next step

### Step 3: Set Up Supabase Project

1. Go to https://supabase.com and create a free account
2. Click "New Project" and fill in:
   - Project name: `phone-banker-training` (or your choice)
   - Database password: Choose a strong password
   - Region: Choose closest to your location
3. Wait for the project to finish setting up (2-3 minutes)
4. Once ready, go to **Project Settings** > **API**
5. Copy these two values:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon public key** (a long string starting with `eyJ...`)
6. Go to the **SQL Editor** tab
7. Click "New Query"
8. Copy the entire contents of `DATABASE_SCHEMA.sql` and paste it
9. Click "Run" to create all tables and functions

### Step 4: Configure Environment Variables

1. In the project root, you'll find `.env.local` file
2. Edit it and add your credentials:

```env
# Vapi Public Key (from Step 2)
NEXT_PUBLIC_VAPI_PUBLIC_KEY=pk_your_actual_key_here

# Supabase URL (from Step 3)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co

# Supabase Anon Key (from Step 3)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxx...
```

3. Save the file

### Step 5: Run the Development Server

```bash
npm run dev
```

The application should now be running at http://localhost:3000

### Step 6: Test the Platform

1. Open http://localhost:3000 in your browser
2. Click "Start Training" or "Get Started Now"
3. You should see the dashboard with voter profiles
4. Click "Start Practice Call" on any profile
5. Click "Start Call" to begin a simulated conversation

## ✅ Verification Checklist

- [ ] Dependencies installed successfully
- [ ] Vapi account created and public key obtained
- [ ] Supabase project created
- [ ] Database schema executed in Supabase SQL Editor
- [ ] Environment variables configured in `.env.local`
- [ ] Development server runs without errors
- [ ] Can access the landing page
- [ ] Can navigate to dashboard
- [ ] Can see all voter profiles
- [ ] Can start a practice call (may need microphone permission)

## 🐛 Troubleshooting

### "Vapi public key not found" Warning

**Problem**: You see a console warning about Vapi key missing.

**Solution**: Make sure you've added `NEXT_PUBLIC_VAPI_PUBLIC_KEY` to `.env.local` and restarted the dev server.

### "Supabase credentials not found" Warning

**Problem**: You see a console warning about Supabase credentials.

**Solution**: 
1. Verify both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are in `.env.local`
2. Make sure there are no extra spaces or quotes around the values
3. Restart the dev server

### Voice Call Not Starting

**Problem**: Click "Start Call" but nothing happens.

**Solutions**:
1. Check browser console for errors
2. Verify your Vapi public key is correct
3. Ensure you've granted microphone permissions to the browser
4. Try in a different browser (Chrome/Edge recommended)

### Database Errors

**Problem**: Errors when trying to save call sessions.

**Solution**:
1. Go back to Supabase SQL Editor
2. Re-run the `DATABASE_SCHEMA.sql` script
3. Check that all tables were created (users, call_sessions, performance_metrics)

### Port Already in Use

**Problem**: Error saying port 3000 is already in use.

**Solution**:
```bash
# Run on a different port
npm run dev -- -p 3001
```

## 🔧 Advanced Configuration

### Customizing Vapi Voice

Edit `lib/vapi.ts` and modify the voice configuration:

```typescript
voice: {
  provider: "11labs",  // or "azure", "playht", etc.
  voiceId: "YOUR_VOICE_ID",  // Change to different voice
}
```

Available voice providers in Vapi:
- 11labs (default, very natural)
- Azure
- PlayHT
- Deepgram

### Adding Custom Voter Profiles

Edit `lib/voterProfiles.ts` and add new profiles to the array. Follow the existing format.

### Modifying Performance Metrics

Edit `lib/analytics.ts` to change how calls are scored or to integrate with external AI services for better analysis.

## 📞 Testing Voice Calls

1. When you click "Start Call", Vapi will request microphone access
2. Allow microphone access in your browser
3. You should hear the voter say "Hello?"
4. Start speaking naturally as if you're a phone banker
5. The AI voter will respond based on their profile
6. Click "End Call" when done
7. Review your performance report

## 🚀 Next Steps

Once everything is working:

1. **Practice with Easy Profiles**: Start with supportive voters
2. **Read Profile Details**: Understand each voter's concerns before calling
3. **Review Performance Reports**: Learn from the analytics
4. **Progress to Harder Profiles**: Challenge yourself as you improve
5. **Customize Profiles**: Add your own voter personas for specific scenarios

## 🆘 Still Having Issues?

- Check the main README.md for additional documentation
- Review the Vapi documentation: https://docs.vapi.ai
- Review the Supabase documentation: https://supabase.com/docs
- Check that you're using Node.js 18 or higher: `node --version`

## 🎓 Ready to Train!

Once setup is complete, you're ready to start training! Remember:
- The platform works best with a good microphone
- Speak clearly and naturally
- Take your time to read voter profiles
- Learn from each call's performance report
- Practice regularly to improve

Good luck! 📞✨

