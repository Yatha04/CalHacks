# Vapi Integration Troubleshooting Guide

This document covers common Vapi errors and how to resolve them.

## 🚨 Common Errors

### 1. "Meeting ended due to ejection: Meeting has ended"

**What it means:** Vapi forcefully terminated the call due to a configuration or service issue.

**Common causes:**
- Invalid voice provider or voice ID
- Invalid model configuration
- Insufficient Vapi credits
- Invalid API key or permissions
- Malformed assistant configuration

**Solutions:**

#### Quick Fix: Use Pre-configured Assistants (Recommended)

Instead of using inline configuration, create assistants in the Vapi Dashboard:

1. Go to https://dashboard.vapi.ai/assistants
2. Click "Create Assistant"
3. Configure:
   - **Model**: OpenAI GPT-3.5-turbo (reliable, fast)
   - **Voice**: Azure/andrew or PlayHT/jennifer
   - **System Prompt**: Your voter personality
   - **First Message**: "Hello?"
   - **Max Duration**: 600 seconds
4. Copy the Assistant ID
5. Add to voter profile:
   ```typescript
   {
     id: "voter-id",
     name: "Voter Name",
     vapiAssistantId: "asst_abc123...", // Add this
     // ... rest
   }
   ```

#### Alternative: Fix Inline Configuration

If you must use inline config, ensure:
- Valid voice provider: `azure`, `playht`, or `elevenlabs`
- Valid voice ID for the chosen provider
- Model: `gpt-3.5-turbo` or `gpt-4`
- Messages array with system message

### 2. "Failed to start call (unknown): Bad Request [cors]"

**What it means:** The assistant configuration format is incorrect.

**Solution:**
Check that your configuration matches this structure:
```typescript
{
  name: "Assistant Name",
  model: {
    provider: "openai",
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "Your system prompt here"
      }
    ]
  },
  voice: {
    provider: "azure",
    voiceId: "andrew"
  },
  firstMessage: "Hello?",
  recordingEnabled: true,
  silenceTimeoutSeconds: 30,
  maxDurationSeconds: 600
}
```

### 3. Empty Error Objects `{}`

**What it means:** Vapi is emitting non-critical error events that can be ignored.

**Solution:** These are now automatically filtered out by the error handler.

## ✅ Verification Checklist

Before starting a call, verify:

- [ ] `NEXT_PUBLIC_VAPI_PUBLIC_KEY` is set in `.env.local`
- [ ] Vapi account has sufficient credits
- [ ] Microphone permissions are granted
- [ ] Internet connection is stable
- [ ] Using pre-configured assistant OR valid inline config

## 🔍 Debugging

The app now provides detailed console logging:

- 🔵 Blue: Information/status messages
- ✅ Green: Success messages
- ❌ Red: Error messages

Check the browser console for detailed diagnostic information when errors occur.

## 📊 Recommended Configuration

For the most reliable experience:

```typescript
// lib/voterProfiles.ts
export const voterProfiles: VoterProfile[] = [
  {
    id: "working-mom",
    name: "Working Mom - Queens",
    vapiAssistantId: "asst_your_id_here", // Create in Vapi Dashboard
    difficulty: "Easy",
    location: "Queens, NY",
    // ... rest of profile
  },
  // ... more profiles
];
```

## 🆘 Still Having Issues?

1. Check Vapi Dashboard for error logs: https://dashboard.vapi.ai/logs
2. Verify your account status and credits
3. Test with a simple pre-configured assistant first
4. Check browser console for detailed error messages
5. Ensure you're using a supported browser (Chrome, Edge recommended)

## 📚 References

- Vapi Documentation: https://docs.vapi.ai
- Vapi Dashboard: https://dashboard.vapi.ai
- Vapi Support: https://docs.vapi.ai/support

