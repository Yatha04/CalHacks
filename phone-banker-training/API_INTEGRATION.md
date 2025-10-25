# API Integration Guide

This guide explains how to integrate external services and customize the platform's AI capabilities.

## 🎙️ Vapi Voice AI Integration

### Basic Configuration

The platform uses Vapi for realistic voice conversations. The integration is in `lib/vapi.ts`.

### Creating Custom Voice Assistants

You can create assistants in two ways:

#### 1. Inline Configuration (Current Implementation)

The app creates assistants on-the-fly when calls start:

```typescript
const assistantConfig = createVoterAssistantConfig(profile);
await vapi.start(assistantConfig);
```

**Pros:**
- Flexible, easy to modify profiles
- No pre-setup needed
- Good for development

**Cons:**
- Slightly slower call initiation
- Less control over fine-tuning

#### 2. Pre-configured Assistants (Recommended for Production)

Create assistants in Vapi dashboard for better performance:

1. Go to https://dashboard.vapi.ai
2. Click "Assistants" > "Create Assistant"
3. Configure for each voter profile:

**Example for "Working Mom - Queens":**

```json
{
  "name": "Voter: Working Mom Queens",
  "model": {
    "provider": "openai",
    "model": "gpt-4",
    "systemPrompt": "You are a 40-something working mom in Queens..."
  },
  "voice": {
    "provider": "11labs",
    "voiceId": "21m00Tcm4TlvDq8ikWAM"
  },
  "firstMessage": "Hello?",
  "endCallFunctionEnabled": true
}
```

4. Copy the Assistant ID (looks like `ast_...`)
5. Add to voter profile:

```typescript
// In lib/voterProfiles.ts
{
  id: "easy-1",
  name: "Working Mom - Queens Borough",
  vapiAssistantId: "ast_your_assistant_id_here",
  // ... rest of profile
}
```

### Voice Customization

#### Available Voice Providers:

1. **ElevenLabs** (Best quality, default)
   ```typescript
   voice: {
     provider: "11labs",
     voiceId: "21m00Tcm4TlvDq8ikWAM" // Rachel
   }
   ```

   Popular voice IDs:
   - `21m00Tcm4TlvDq8ikWAM` - Rachel (young female)
   - `29vD33N1CtxCmqQRPOHJ` - Drew (young male)
   - `flq6f7yk4E4fJM5XTYuZ` - Michael (mature male)

2. **Azure**
   ```typescript
   voice: {
     provider: "azure",
     voiceId: "en-US-JennyNeural"
   }
   ```

3. **PlayHT**
   ```typescript
   voice: {
     provider: "playht",
     voiceId: "jennifer"
   }
   ```

### Advanced Vapi Features

#### Function Calling

Let the AI trigger actions during calls:

```typescript
// In lib/vapi.ts
{
  model: {
    functions: [
      {
        name: "transferToSupervisor",
        description: "Transfer the call if the volunteer needs help",
        parameters: {
          type: "object",
          properties: {
            reason: { type: "string" }
          }
        }
      }
    ]
  }
}
```

Handle in CallInterface.tsx:

```typescript
vapiRef.current.on("function-call", (functionCall) => {
  if (functionCall.name === "transferToSupervisor") {
    // Handle transfer logic
  }
});
```

#### Custom Events

Track specific conversation events:

```typescript
vapiRef.current.on("message", (message) => {
  if (message.type === "conversation-update") {
    // Track conversation progress
  }
});
```

---

## 🗄️ Supabase Database Integration

### Current Implementation

The platform uses Supabase for data persistence. Integration is in `lib/supabase.ts`.

### Advanced Queries

#### Get User Performance Over Time

```typescript
export async function getUserPerformanceTrend(userId: string) {
  const { data, error } = await supabase
    .from("call_sessions")
    .select(`
      id,
      created_at,
      performance_metrics (
        overall_score,
        confidence,
        persuasiveness
      )
    `)
    .eq("user_id", userId)
    .eq("status", "completed")
    .order("created_at", { ascending: true });

  return data;
}
```

#### Leaderboard Query

```typescript
export async function getLeaderboard(limit: number = 10) {
  const { data, error } = await supabase
    .from("performance_metrics")
    .select(`
      overall_score,
      call_sessions!inner (
        user_id,
        users (name, email)
      )
    `)
    .order("overall_score", { ascending: false })
    .limit(limit);

  return data;
}
```

### Real-time Updates

Add real-time leaderboards or progress tracking:

```typescript
// In a component
useEffect(() => {
  const subscription = supabase
    .channel('public:call_sessions')
    .on('postgres_changes', 
      { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'call_sessions' 
      }, 
      (payload) => {
        console.log('New call started!', payload);
      }
    )
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
}, []);
```

---

## 🤖 AI-Powered Performance Analysis

### Current Implementation

Basic analysis is in `lib/analytics.ts`. It uses simple heuristics.

### Upgrade to OpenAI API

For production-quality analysis:

1. **Install OpenAI SDK**
   ```bash
   npm install openai
   ```

2. **Create AI Analyzer**

```typescript
// lib/aiAnalyzer.ts
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeCallWithAI(transcript: string) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `You are an expert phone banking coach. Analyze the following call transcript and provide:
        
1. Scores (0-100) for:
   - Confidence
   - Enthusiasm
   - Clarity
   - Persuasiveness
   - Empathy

2. List 3-5 specific strengths
3. List 3-5 specific areas for improvement
4. Identify 2-3 key moments with timestamps
5. Overall sentiment (positive/neutral/negative)

Format your response as JSON.`
      },
      {
        role: "user",
        content: transcript
      }
    ],
    response_format: { type: "json_object" }
  });

  return JSON.parse(completion.choices[0].message.content);
}
```

3. **Update analytics.ts**

```typescript
export async function analyzeCallPerformance(
  transcript: string,
  duration: number,
  voterProfileDifficulty: string
) {
  // Use AI analysis instead of heuristics
  const aiAnalysis = await analyzeCallWithAI(transcript);
  
  return {
    ...aiAnalysis,
    // Adjust scores based on difficulty
    overallScore: adjustForDifficulty(
      aiAnalysis.overallScore,
      voterProfileDifficulty
    )
  };
}
```

### Alternative: Anthropic Claude

```typescript
// lib/aiAnalyzer.ts
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function analyzeCallWithClaude(transcript: string) {
  const message = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `Analyze this phone banking call transcript...
        
${transcript}

Provide analysis as JSON.`
      }
    ]
  });

  return JSON.parse(message.content[0].text);
}
```

---

## 📊 Advanced Analytics Integration

### Google Analytics

```bash
npm install @next/third-parties
```

```typescript
// app/layout.tsx
import { GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
      <GoogleAnalytics gaId="G-XXXXXXXXXX" />
    </html>
  )
}
```

### Mixpanel for Event Tracking

```bash
npm install mixpanel-browser
```

```typescript
// lib/analytics/mixpanel.ts
import mixpanel from 'mixpanel-browser';

mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN);

export function trackCallStarted(profileId: string, difficulty: string) {
  mixpanel.track('Call Started', {
    profileId,
    difficulty,
    timestamp: new Date().toISOString()
  });
}

export function trackCallCompleted(
  profileId: string,
  score: number,
  duration: number
) {
  mixpanel.track('Call Completed', {
    profileId,
    score,
    duration
  });
}
```

---

## 🔗 Webhook Integration

### Receive Vapi Call Events

Set up a webhook endpoint to receive call events from Vapi:

```typescript
// app/api/webhooks/vapi/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const payload = await request.json();

  switch (payload.type) {
    case 'call-started':
      // Handle call start
      break;
    case 'call-ended':
      // Save final transcript and metrics
      await saveCallData(payload);
      break;
    case 'transcript':
      // Real-time transcript updates
      break;
  }

  return NextResponse.json({ received: true });
}

async function saveCallData(payload: any) {
  // Save to Supabase
  const { data, error } = await supabase
    .from('call_sessions')
    .update({
      transcript: payload.transcript,
      duration: payload.duration,
      status: 'completed'
    })
    .eq('vapi_call_id', payload.callId);
}
```

Configure in Vapi dashboard:
- Go to Settings > Webhooks
- Add: `https://yourdomain.com/api/webhooks/vapi`

---

## 🔐 Authentication Integration

### Supabase Auth

```typescript
// lib/auth.ts
import { supabase } from './supabase';

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

export async function signOut() {
  await supabase.auth.signOut();
}

export function getCurrentUser() {
  return supabase.auth.getUser();
}
```

### Protected Routes

```typescript
// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return res;
}
```

---

## 📧 Email Notifications

### SendGrid Integration

```bash
npm install @sendgrid/mail
```

```typescript
// lib/email.ts
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function sendPerformanceReport(
  userEmail: string,
  metrics: PerformanceMetrics
) {
  const msg = {
    to: userEmail,
    from: 'noreply@yourapp.com',
    subject: 'Your Phone Banking Practice Report',
    html: `
      <h1>Practice Call Complete!</h1>
      <p>Your score: ${metrics.overallScore}</p>
      <h2>Strengths:</h2>
      <ul>
        ${metrics.strengths.map(s => `<li>${s}</li>`).join('')}
      </ul>
    `,
  };

  await sgMail.send(msg);
}
```

---

## 🎯 Custom Integrations

### Slack Notifications

When volunteers complete difficult calls:

```typescript
// lib/slack.ts
export async function notifySlack(message: string) {
  await fetch(process.env.SLACK_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: message })
  });
}

// Use after hard-level calls
if (difficulty === 'hard' && score > 80) {
  await notifySlack(
    `🎉 ${userName} just aced a hard-level call with score ${score}!`
  );
}
```

---

## 🧪 Testing APIs

### Test Vapi Integration

```typescript
// __tests__/vapi.test.ts
import { createVoterAssistantConfig } from '@/lib/vapi';

test('creates valid assistant config', () => {
  const profile = {
    name: 'Test Voter',
    description: 'Test',
    personality: 'Friendly',
    keyIssues: ['housing'],
    skepticism: 'None'
  };

  const config = createVoterAssistantConfig(profile);
  
  expect(config.model.provider).toBe('openai');
  expect(config.voice.provider).toBe('11labs');
  expect(config.firstMessage).toBe('Hello?');
});
```

---

## 📚 Additional Resources

- [Vapi Documentation](https://docs.vapi.ai)
- [Supabase Documentation](https://supabase.com/docs)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

---

## 💡 Pro Tips

1. **Cache Voice Configs**: Store frequently-used assistant configurations
2. **Batch Database Writes**: Reduce Supabase API calls
3. **Use Edge Functions**: Deploy API routes to the edge for lower latency
4. **Monitor API Usage**: Set up alerts for Vapi/OpenAI usage spikes
5. **Version Your Prompts**: Track changes to AI system prompts

Need help integrating a specific service? Check the main README or create an issue!

