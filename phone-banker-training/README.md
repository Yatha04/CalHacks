# Grassroots Training Platform

A LeetCode-style training platform for mayoral election phone bank volunteers. Practice realistic voter conversations with AI-powered voice agents across multiple difficulty levels, and receive detailed performance analytics.

## 🎯 Features

- **Realistic Voter Simulations**: Practice calls with AI-powered voter personas using Vapi voice agents
- **Three Difficulty Levels**: 
  - **Easy**: Supportive voters who need basic engagement
  - **Medium**: Voters requiring persuasion and addressing specific concerns
  - **Hard**: Skeptical or opposed voters needing advanced techniques
- **Performance Analytics**: Get detailed feedback on:
  - Confidence
  - Enthusiasm  
  - Clarity
  - Persuasiveness
  - Empathy
- **Progress Tracking**: Monitor improvement over time with comprehensive metrics
- **Real-time Transcription**: Review conversation transcripts after each call

## 🏗️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **Voice AI**: Vapi (https://vapi.ai)
- **Database**: Supabase (PostgreSQL)
- **Analytics**: Custom sentiment analysis integration

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Vapi account (https://dashboard.vapi.ai)
- Supabase project (https://supabase.com)

## 🚀 Getting Started

### 1. Clone and Install

```bash
cd grassroots-training
npm install
```

**Note:** This will automatically install all required dependencies listed in `package.json`, including:
- Next.js 16
- React 19
- TypeScript
- Vapi AI SDK (`@vapi-ai/web`)
- Supabase client (`@supabase/supabase-js`)
- Lenis (smooth scrolling)
- Lucide React (icons)
- Tailwind CSS

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory with your credentials:

```env
# Supabase Configuration (Required for authentication)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Vapi Configuration (Optional - for voice calls)
NEXT_PUBLIC_VAPI_PUBLIC_KEY=your_vapi_public_key_here
```

**Important**: 
- Get your Supabase credentials from your project dashboard under Settings > API
- The Supabase credentials are required for the authentication system to work
- Vapi credentials are optional - the app will work without them but voice calls will be disabled

### 3. Set Up Supabase Database

1. Create a new Supabase project at https://supabase.com
2. Go to the SQL Editor in your Supabase dashboard
3. Copy and run the SQL from `DATABASE_SCHEMA.sql`
4. This will create all necessary tables, indexes, functions, and RLS policies

**Note**: If you're upgrading from an older version or encounter user profile creation errors, check the `migrations/` folder for update scripts.

### 4. Configure Vapi

1. Sign up at https://dashboard.vapi.ai
2. Get your Public Key from the dashboard
3. Add your public key to `.env.local`

#### Option A: Use Inline Configuration (Simpler, but may have issues)
The app will automatically create assistant configurations on-the-fly using the voter profiles. This works but may be less reliable.

#### Option B: Pre-configured Assistants (Recommended for Production)
For better reliability and performance, create assistants in the Vapi Dashboard:

1. Go to https://dashboard.vapi.ai/assistants
2. Click "Create Assistant"
3. Configure the assistant:
   - **Name**: e.g., "Voter: Working Mom - Queens"
   - **Model**: OpenAI GPT-3.5-turbo or GPT-4
   - **System Prompt**: Copy the voter's personality/description from `lib/voterProfiles.ts`
   - **Voice**: Choose Azure, PlayHT, or ElevenLabs voice
   - **First Message**: "Hello?"
   - **Recording**: Enable
4. Copy the Assistant ID
5. Add `vapiAssistantId: "your-assistant-id"` to the voter profile in `lib/voterProfiles.ts`

**Example voter profile with pre-configured assistant:**
```typescript
{
  id: "working-mom",
  name: "Working Mom - Queens",
  vapiAssistantId: "asst_abc123...",  // Add this line
  difficulty: "Easy",
  // ... rest of profile
}
```

**Troubleshooting**: If you see "ejection" errors, this usually means the inline configuration is invalid. Use pre-configured assistants instead.

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📂 Project Structure

```
phone-banker-training/
├── app/                      # Next.js App Router pages
│   ├── page.tsx             # Landing page
│   ├── dashboard/           # Dashboard with voter profiles
│   └── practice/            # Practice call interface
├── components/              # React components
│   ├── ui/                  # Base UI components (Button, Card)
│   ├── CallInterface.tsx    # Call interface with Vapi integration
│   ├── VoterProfileCard.tsx # Voter profile display
│   └── PerformanceReport.tsx # Performance analytics
├── lib/                     # Utility libraries
│   ├── vapi.ts             # Vapi client and configuration
│   ├── supabase.ts         # Supabase client and helpers
│   ├── voterProfiles.ts    # Voter persona definitions
│   ├── analytics.ts        # Performance analysis logic
│   └── utils.ts            # General utilities
├── types/                   # TypeScript type definitions
│   └── index.ts            # Core type definitions
└── DATABASE_SCHEMA.sql      # Database setup script
```

## 🗣️ Voter Profiles

The platform includes 7 pre-configured voter profiles:

### Easy (3 profiles)
1. **Working Mom - Queens**: Practical, focused on cost of living
2. **Small Business Owner - Brooklyn**: Tax-concerned, community-minded
3. **Retired Senior - Staten Island**: Traditional, values experience

### Medium (2 profiles)
1. **Millennial Tech Worker - Manhattan**: Progressive, questioning
2. **New Immigrant Family - Brooklyn/Queens**: Family-focused, hopeful but guarded

### Hard (2 profiles)
1. **Disillusioned Former Democrat - Bronx**: Cynical, needs genuine engagement
2. **Independent Conservative - Staten Island**: Traditional values, skeptical of progressive policies

## 📊 Performance Metrics

After each call, volunteers receive scores (0-100) on:

- **Confidence**: Voice tone, certainty, delivery strength
- **Enthusiasm**: Energy level, passion for the campaign
- **Clarity**: Message organization, speaking pace
- **Persuasiveness**: Addressing concerns, making compelling arguments
- **Empathy**: Active listening, acknowledging voter concerns

Plus:
- Identified strengths
- Areas for improvement
- Key moments in the conversation
- Overall sentiment analysis

## 🔧 Customization

### Adding New Voter Profiles

Edit `lib/voterProfiles.ts` to add new personas:

```typescript
{
  id: "custom-1",
  name: "Your Voter Name",
  difficulty: "medium",
  description: "Brief description",
  age: "Age range",
  location: "Borough/Area",
  occupation: "Job",
  income: "Income level",
  votingHistory: "Voting pattern",
  keyIssues: ["Issue 1", "Issue 2", "Issue 3"],
  skepticism: "What makes them skeptical",
  personality: "How they communicate"
}
```

### Customizing Analytics

Modify `lib/analytics.ts` to integrate with your preferred AI service (OpenAI, Anthropic, etc.) for more sophisticated sentiment analysis.

### Voice Customization

In `lib/vapi.ts`, you can customize:
- Voice provider and voice ID
- Model selection (GPT-4, GPT-3.5, etc.)
- Call duration limits
- First message greeting

## 🧪 Testing Without Vapi

The platform will work without Vapi credentials for development, but voice calls will be disabled. You can still:
- Browse voter profiles
- View the UI and flow
- Test the analytics display (with mock data)

## 🚢 Deployment

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Make sure to add environment variables in your Vercel project settings.

### Other Platforms

The app is a standard Next.js application and can be deployed to:
- Netlify
- AWS Amplify
- Railway
- Self-hosted with Docker

## 🔐 Security Considerations

- Never commit `.env.local` to version control
- Use Supabase Row Level Security (RLS) to protect user data
- Implement proper authentication before production deployment
- Consider rate limiting for API calls
- Review and audit AI-generated content

## 🐛 Troubleshooting

### "Error creating user profile" during signup

If you encounter this error, it means your database is missing the required RLS (Row Level Security) policies for user profile creation.

**Fix**: Run the migration script in your Supabase SQL Editor:
1. Go to your Supabase dashboard > SQL Editor
2. Copy and run the SQL from `migrations/fix_user_rls_policies.sql`
3. This adds the necessary INSERT and UPDATE policies for the users table

Alternatively, if you're setting up a new database, make sure you run the complete `DATABASE_SCHEMA.sql` which includes all required policies.

### Voice calls not working

**Error: "Vapi error: {}" or configuration errors**

This error occurs when the Vapi public key is not configured:

1. Create a `.env.local` file in the `phone-banker-training/` directory
2. Add the following line: `NEXT_PUBLIC_VAPI_PUBLIC_KEY=your_vapi_public_key_here`
3. Get your public key from https://dashboard.vapi.ai (Settings > API Keys)
4. Restart your development server (`npm run dev`)

**Other voice call issues:**

- Check browser console for detailed Vapi error messages
- Ensure you have microphone permissions enabled in your browser
- Verify your Vapi account has sufficient credits
- Try refreshing the page and starting a new call

### Authentication issues

- Verify Supabase URL and anon key are correctly set in `.env.local`
- Check that the database schema has been applied
- Ensure RLS policies are properly configured
- Try clearing browser cookies and cache

## 🤝 Contributing

This is a training platform. Suggested improvements:
- Additional voter profiles for different demographics
- More sophisticated sentiment analysis
- Real-time coaching during calls
- Team leaderboards and competitions
- Integration with actual phone banking tools

## 📄 License

This project is open source and available for educational purposes.

## 🆘 Support

For issues or questions:
1. Check the Vapi documentation: https://docs.vapi.ai
2. Check the Supabase documentation: https://supabase.com/docs
3. Review the Next.js documentation: https://nextjs.org/docs

## 🎓 Training Tips

1. **Start Easy**: Build confidence with supportive voters first
2. **Read Profiles Carefully**: Understanding voter concerns is key
3. **Be Authentic**: Voters respond better to genuine conversation
4. **Address Concerns**: Don't ignore skepticism - acknowledge it
5. **Review Performance**: Learn from each call's analytics
6. **Progress Gradually**: Move to harder profiles as you improve
7. **Practice Regularly**: Consistency builds skill

Good luck with your phone banking training! 📞🗳️
