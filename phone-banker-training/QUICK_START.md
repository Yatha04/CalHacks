# Quick Start Guide

Get up and running with the Phone Banker Training Platform in 10 minutes!

## ⚡ Super Quick Setup (Development Mode)

If you want to explore the platform without setting up external services:

```bash
cd phone-banker-training
npm install
npm run dev
```

Open http://localhost:3000

**Note**: Voice calls won't work without Vapi credentials, but you can:
- Browse all voter profiles
- See the UI and navigation
- Understand the platform structure

---

## 🚀 Full Setup (With Voice Calls)

### 1. Install Dependencies (1 minute)

```bash
cd phone-banker-training
npm install
```

### 2. Get Your API Keys (5 minutes)

#### Vapi (Required for voice calls)
1. Go to https://dashboard.vapi.ai
2. Sign up (free trial available)
3. Copy your Public Key (starts with `pk_...`)

#### Supabase (Required for data storage)
1. Go to https://supabase.com
2. Create new project
3. Copy Project URL and anon key
4. Run the SQL in `DATABASE_SCHEMA.sql` in the SQL Editor

### 3. Configure Environment (1 minute)

Edit `.env.local`:

```env
NEXT_PUBLIC_VAPI_PUBLIC_KEY=pk_your_key_here
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
```

### 4. Run the App (1 minute)

```bash
npm run dev
```

Visit http://localhost:3000

### 5. Make Your First Call (2 minutes)

1. Click "Start Training"
2. Select an Easy profile (try "Working Mom - Queens")
3. Click "Start Practice Call"
4. Allow microphone access
5. Click "Start Call"
6. Say "Hello!" and start your pitch!

---

## 🎯 What to Try First

### For Complete Beginners
1. Read the landing page to understand the concept
2. Browse the Easy voter profiles on the dashboard
3. Read a profile carefully before calling
4. Practice with "Working Mom - Queens" first (most supportive)

### For Experienced Phone Bankers
1. Skip Easy profiles and go straight to Medium/Hard
2. Try "Disillusioned Former Democrat" for a real challenge
3. Focus on the performance analytics after each call
4. Track your improvement over multiple calls

---

## 💡 First Call Tips

### Before You Start
- Read the entire voter profile
- Note their key concerns (housing, crime, etc.)
- Understand their skepticism
- Have a notepad ready for notes

### During the Call
- Speak naturally, not like reading a script
- Listen to their concerns
- Address specific issues they mention
- Stay confident even if they're skeptical
- Don't rush - take your time

### After the Call
- Review your transcript
- Study the performance metrics
- Read the improvement suggestions
- Think about what you'd do differently

---

## 🐛 Troubleshooting

### "Vapi public key not found" Warning

**Fix**: Add `NEXT_PUBLIC_VAPI_PUBLIC_KEY` to `.env.local` and restart dev server

### "Supabase credentials not found" Warning

**Fix**: Add Supabase credentials to `.env.local` and restart dev server

### Voice Call Doesn't Start

**Fixes**:
- Check browser console for errors
- Grant microphone permissions
- Try Chrome or Edge (best WebRTC support)
- Verify Vapi key is correct

### No Sound / Can't Hear Voter

**Fixes**:
- Check your system volume
- Check browser audio settings
- Try refreshing the page
- Verify your speakers/headphones work

---

## 📚 What to Read Next

After your first successful call:

1. **README.md** - Full documentation
2. **SETUP_GUIDE.md** - Detailed setup instructions
3. **API_INTEGRATION.md** - Customize the platform
4. **DEPLOYMENT.md** - Deploy to production

---

## 🎓 Learning Path

### Week 1: Master the Basics
- Complete 3 Easy profile calls
- Focus on natural conversation flow
- Aim for 70+ scores

### Week 2: Build Confidence
- Complete 3 Medium profile calls
- Practice addressing specific concerns
- Aim for 75+ scores

### Week 3: Take on Challenges
- Complete 2 Hard profile calls
- Master dealing with skepticism
- Aim for 80+ scores

### Week 4: Expert Level
- Mix of all difficulty levels
- Focus on specific weak areas
- Consistently score 85+

---

## ⚙️ Customization Ideas

Once you're comfortable with the platform:

### Add Your Own Voter Profiles

Edit `lib/voterProfiles.ts`:

```typescript
{
  id: "custom-1",
  name: "Your Custom Voter",
  difficulty: "medium",
  description: "Brief description",
  // ... other fields
}
```

### Adjust Performance Metrics

Edit `lib/analytics.ts` to change how calls are scored

### Change Voice Settings

Edit `lib/vapi.ts` to use different voices

### Add New Features

- Leaderboards (`components/Leaderboard.tsx`)
- Team competitions
- More detailed analytics
- Call recording playback

---

## 🤝 Getting Help

### Common Questions

**Q: Do I need to pay for Vapi?**
A: They offer a free trial. After that, pricing is per-minute of voice calls.

**Q: Can multiple people use this?**
A: Yes! Each person can track their own progress if you implement authentication.

**Q: Can I use this offline?**
A: No, it requires internet for voice AI (Vapi) and database (Supabase).

**Q: How accurate is the performance analysis?**
A: The basic version uses heuristics. For better accuracy, integrate OpenAI (see API_INTEGRATION.md).

### Resources

- [Vapi Docs](https://docs.vapi.ai)
- [Supabase Docs](https://supabase.com/docs)
- [Next.js Docs](https://nextjs.org/docs)

---

## ✅ Success Checklist

- [ ] npm install completed successfully
- [ ] Vapi account created
- [ ] Supabase project created and database setup
- [ ] Environment variables configured
- [ ] Dev server runs without errors
- [ ] Can access homepage
- [ ] Can see voter profiles
- [ ] Can start a practice call
- [ ] Microphone permission granted
- [ ] Successfully completed first call
- [ ] Received performance report

---

## 🎉 You're Ready!

Once you've completed your first call and reviewed the performance report, you're ready to start serious training!

**Remember**: 
- Practice regularly
- Learn from each call
- Progress gradually through difficulties
- Review your analytics
- Be patient with yourself

Good luck with your phone banking training! 📞🗳️

---

## 🚀 Next Steps

1. Complete 3-5 practice calls this week
2. Invite your team to use the platform
3. Share feedback for improvements
4. Consider deploying to production (see DEPLOYMENT.md)

