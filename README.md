# CalHacks: Grassroots Training Platform

> **Master the Art of Political Phone Banking with AI-Powered Training**

A comprehensive training platform that combines realistic voter simulations with advanced performance analytics to help political volunteers excel at phone banking. Built for CalHacks, this project features both a Next.js training application and an MCP server for AI-powered call analysis.

## 🎯 Project Overview

The Grassroots Training Platform is a **LeetCode-style training system** for political phone banking volunteers. It provides:

- **Realistic AI-powered voter simulations** using voice agents
- **Progressive difficulty levels** (Easy → Medium → Hard)
- **Comprehensive performance analytics** with detailed feedback
- **Progress tracking** and improvement insights
- **AI-powered call analysis** via MCP server integration

## 🏗️ Architecture

This project consists of two main components:

### 1. **Training Application** (`phone-banker-training/`)
A Next.js web application that provides the core training experience.

### 2. **MCP Server** (`phone-banker-mcp-server/`)
A Model Context Protocol server that exposes call data to AI assistants for advanced analysis.

```
┌─────────────────────┐    ┌─────────────────────┐
│   Training App      │    │    MCP Server       │
│   (Next.js)         │    │   (Node.js/Express) │
│                     │    │                     │
│ • Voter Profiles    │    │ • Call Analytics    │
│ • Voice Calls       │    │ • Transcripts       │
│ • Performance UI    │    │ • Recordings        │
│ • Progress Tracking │    │ • AI Integration    │
└─────────────────────┘    └─────────────────────┘
           │                           │
           └───────────┬───────────────┘
                       │
            ┌─────────────────────┐
            │   External Services │
            │                     │
            │ • Vapi (Voice AI)   │
            │ • Supabase (DB)     │
            │ • Claude/Poke (AI)  │
            └─────────────────────┘
```

## 🚀 Quick Start

### Option 1: Explore the Training App (5 minutes)

```bash
cd phone-banker-training
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to explore the UI and voter profiles.

### Option 2: Full Setup with Voice Calls (15 minutes)

1. **Set up external services:**
   - Create a [Vapi account](https://dashboard.vapi.ai) for voice AI
   - Create a [Supabase project](https://supabase.com) for data storage

2. **Configure environment:**
   ```bash
   cd phone-banker-training
   cp .env.example .env.local
   # Add your Vapi and Supabase credentials
   ```

3. **Set up database:**
   - Run the SQL from `DATABASE_SCHEMA.sql` in your Supabase SQL Editor

4. **Start the application:**
   ```bash
   npm run dev
   ```

5. **Make your first call:**
   - Click "Start Training"
   - Select "Working Mom - Queens" (Easy difficulty)
   - Allow microphone access
   - Start practicing!

## 🎮 Features

### Training Application

- **🗣️ Realistic Voter Simulations**: 7 pre-configured voter personas across NYC boroughs
- **📊 Three Difficulty Levels**:
  - **Easy**: Supportive voters (Working Mom, Small Business Owner, Retired Senior)
  - **Medium**: Persuasion-focused voters (Tech Worker, New Immigrant Family)
  - **Hard**: Skeptical voters (Disillusioned Democrat, Conservative Independent)
- **📈 Performance Analytics**: Detailed scoring on:
  - Confidence, Enthusiasm, Clarity
  - Persuasiveness, Empathy
- **📝 Real-time Transcription**: Review conversation transcripts
- **📊 Progress Tracking**: Monitor improvement over time

### MCP Server

- **📋 List Call Sessions**: Get recent training calls with metadata
- **🔍 Get Call Details**: Fetch complete transcripts and performance metrics
- **🎵 Get Call Recordings**: Retrieve Vapi recording URLs for audio analysis
- **📊 Get User Progress**: View aggregate statistics and progress tracking

## 🛠️ Tech Stack

### Training Application
- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Voice AI**: Vapi AI SDK
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth

### MCP Server
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Protocol**: Model Context Protocol (MCP)
- **Database**: Supabase client
- **Deployment**: Google Cloud Run

## 📂 Project Structure

```
CalHacks/
├── phone-banker-training/          # Main training application
│   ├── app/                        # Next.js App Router pages
│   │   ├── page.tsx               # Landing page
│   │   ├── dashboard/              # Voter profiles dashboard
│   │   └── practice/               # Call interface
│   ├── components/                 # React components
│   │   ├── ui/                    # Base UI components
│   │   ├── CallInterface.tsx      # Voice call interface
│   │   ├── VoterProfileCard.tsx  # Voter profile display
│   │   └── PerformanceReport.tsx # Analytics display
│   ├── lib/                       # Utility libraries
│   │   ├── vapi.ts              # Vapi AI integration
│   │   ├── supabase.ts          # Database client
│   │   ├── voterProfiles.ts     # Voter persona definitions
│   │   └── analytics.ts         # Performance analysis
│   └── DATABASE_SCHEMA.sql       # Database setup
│
└── phone-banker-mcp-server/        # MCP server for AI analysis
    ├── src/
    │   ├── server-http.ts        # HTTP server
    │   ├── tools/                # MCP tool implementations
    │   │   ├── list-call-sessions.ts
    │   │   ├── get-call-details.ts
    │   │   ├── get-call-recording.ts
    │   │   └── get-user-progress.ts
    │   └── utils/                # Utility modules
    │       ├── supabase-client.ts
    │       └── vapi-client.ts
    └── deploy.sh                 # Google Cloud Run deployment
```

## 🗣️ Voter Profiles

The platform includes 7 carefully crafted voter personas:

### Easy Difficulty
- **Working Mom - Queens**: Practical, cost-of-living focused
- **Small Business Owner - Brooklyn**: Tax-concerned, community-minded
- **Retired Senior - Staten Island**: Traditional, values experience

### Medium Difficulty
- **Millennial Tech Worker - Manhattan**: Progressive, questioning
- **New Immigrant Family - Brooklyn/Queens**: Family-focused, hopeful but guarded

### Hard Difficulty
- **Disillusioned Former Democrat - Bronx**: Cynical, needs genuine engagement
- **Independent Conservative - Staten Island**: Traditional values, skeptical of progressive policies

## 📊 Performance Metrics

After each call, volunteers receive detailed feedback on:

- **Confidence** (0-100): Voice tone, certainty, delivery strength
- **Enthusiasm** (0-100): Energy level, passion for the campaign
- **Clarity** (0-100): Message organization, speaking pace
- **Persuasiveness** (0-100): Addressing concerns, making compelling arguments
- **Empathy** (0-100): Active listening, acknowledging voter concerns

Plus:
- Identified strengths and improvement areas
- Key conversation moments
- Overall sentiment analysis
- Transcript review

## 🔧 Configuration

### Environment Variables

**Training Application** (`.env.local`):
```env
# Supabase Configuration (Required)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Vapi Configuration (Optional - for voice calls)
NEXT_PUBLIC_VAPI_PUBLIC_KEY=your_vapi_public_key
```

**MCP Server** (`.env`):
```env
# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# Vapi API Configuration
VAPI_API_KEY=your_vapi_server_api_key

# MCP Server Configuration
MCP_API_KEY=your_secure_api_key
PORT=8080
```

### Adding Custom Voter Profiles

Edit `phone-banker-training/lib/voterProfiles.ts`:

```typescript
{
  id: "custom-voter",
  name: "Your Custom Voter",
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

## 🚢 Deployment

### Training Application
Deploy to Vercel, Netlify, or any Next.js-compatible platform:

```bash
npm run build
npm start
```

### MCP Server
Deploy to Google Cloud Run:

```bash
cd phone-banker-mcp-server
./deploy.sh
```

## 🤖 AI Integration

The MCP server enables AI assistants (like Claude via Poke) to analyze training calls:

```json
{
  "mcpServers": {
    "grassroots-training": {
      "url": "https://your-mcp-server.run.app",
      "apiKey": "your-mcp-api-key",
      "transport": "sse"
    }
  }
}
```

Once configured, you can ask Poke:
- "Show me my recent phone banking training calls"
- "Analyze the recording from my most recent training session"
- "What's my progress in phone banking training?"

## 🎓 Training Tips

1. **Start Easy**: Build confidence with supportive voters first
2. **Read Profiles Carefully**: Understanding voter concerns is key
3. **Be Authentic**: Voters respond better to genuine conversation
4. **Address Concerns**: Don't ignore skepticism - acknowledge it
5. **Review Performance**: Learn from each call's analytics
6. **Progress Gradually**: Move to harder profiles as you improve
7. **Practice Regularly**: Consistency builds skill

## 🐛 Troubleshooting

### Common Issues

**Voice calls not working:**
- Check browser console for Vapi errors
- Ensure microphone permissions are granted
- Verify Vapi public key is correctly set
- Try Chrome or Edge for best WebRTC support

**Authentication issues:**
- Verify Supabase credentials in `.env.local`
- Check that database schema is applied
- Ensure RLS policies are configured

**MCP server connection issues:**
- Verify API key matches in Poke configuration
- Check server logs for detailed error messages
- Ensure all environment variables are set

## 📚 Documentation

- [Quick Start Guide](phone-banker-training/QUICK_START.md) - Get running in 10 minutes
- [Authentication Setup](phone-banker-training/SETUP_AUTH.md) - Complete auth configuration
- [Database Schema](phone-banker-training/DATABASE_SCHEMA.sql) - Database setup
- [MCP Server README](phone-banker-mcp-server/README.md) - Detailed MCP server docs

## 🤝 Contributing

This project was built for CalHacks and is open for educational purposes. Suggested improvements:

- Additional voter profiles for different demographics
- More sophisticated sentiment analysis
- Real-time coaching during calls
- Team leaderboards and competitions
- Integration with actual phone banking tools

## 📄 License

This project is open source and available for educational purposes.

## 🆘 Support

For issues or questions:
- Check the [Vapi documentation](https://docs.vapi.ai)
- Review the [Supabase documentation](https://supabase.com/docs)
- Consult the [Next.js documentation](https://nextjs.org/docs)

---

**Built with ❤️ for CalHacks** | *Because every phone call makes a difference* 📞🗳️
