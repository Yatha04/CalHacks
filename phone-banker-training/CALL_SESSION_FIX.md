# Call Session Database Save Fix

## 🔧 Problem Fixed

Call sessions were not being saved to the database due to missing user profiles in the `users` table, causing foreign key constraint violations.

## 🎯 What Was Changed

### 1. **User Profile Creation in Auth Flow** (`lib/auth.tsx`)
- **Before**: User profiles were only created on the `SIGNED_IN` event, which was inconsistent
- **After**: User profiles are now created/ensured:
  - When the initial session is loaded (for existing logged-in users)
  - On `SIGNED_IN` event (for new logins)
  - On `USER_UPDATED` event (for profile updates)

**Changes:**
```typescript
// Now creates user profile on initial session load
supabase.auth.getSession().then(async ({ data: { session } }) => {
  setSession(session);
  setUser(session?.user ?? null);
  
  // ✅ NEW: Create/ensure user profile exists for existing session
  if (session?.user) {
    await createUserProfile(session.user);
  }
  
  setLoading(false);
});

// Also handles USER_UPDATED events
if ((event === 'SIGNED_IN' || event === 'USER_UPDATED') && session?.user) {
  await createUserProfile(session.user);
}
```

### 2. **Safety Check Function** (`lib/supabase.ts`)
Added `ensureUserProfile()` function that:
- Checks if the user profile exists in the database
- Creates it if missing (with upsert logic)
- Provides clear logging for debugging
- Returns success/failure status

**New function:**
```typescript
export async function ensureUserProfile(userId: string, email?: string, name?: string)
```

### 3. **Pre-Save Validation** (`app/practice/page.tsx`)
- **Before**: Directly attempted to save call sessions, failing silently if user profile missing
- **After**: Explicitly checks that user profile exists before saving
- Provides clear error messages if the check fails
- Alerts user to log out/in if there's an issue

**Changes:**
```typescript
// ✅ NEW: Ensure user profile exists before saving
const userExists = await ensureUserProfile(
  user.id, 
  user.email || undefined, 
  user.user_metadata?.full_name || user.user_metadata?.name
);

if (!userExists) {
  console.error("❌ Failed to ensure user profile exists. Cannot save call session.");
  alert("Failed to save call data. Please try logging out and back in.");
  return;
}
```

### 4. **Enhanced Error Logging** (`lib/supabase.ts`)
All database operations now include:
- Detailed console logging at each step
- Structured error output (message, code, details, hint)
- Clear success/failure indicators (✅/❌ emojis)
- Better error propagation (throws instead of returning null)

## 🧪 How to Test

### Step 1: Fresh Login Test
1. **Log out** if you're currently logged in
2. **Clear browser storage** (optional but recommended):
   - Open DevTools (F12)
   - Go to Application tab → Storage → Clear site data
3. **Sign up** with a new account OR **log in** with existing credentials
4. Check the browser console for:
   ```
   ✅ User profile already exists
   OR
   Creating user profile...
   ✅ User profile created/updated successfully
   ```

### Step 2: Complete a Practice Call
1. Go to **Dashboard** (`/dashboard`)
2. **Select a voter profile** (start with Easy difficulty)
3. **Click "Start Call"**
4. Have a brief conversation with the AI voter
5. **Click "End Call"**
6. Review your performance report

### Step 3: Verify Console Logs
During the call end process, you should see this sequence in the browser console:

```
📊 Call ended - Processing results... { duration: 45, vapiCallId: 'xyz...' }
💾 Saving call session to Supabase...
✅ User profile already exists
📝 Inserting call session: { userId: '...', voterProfileId: '...', vapiCallId: '...' }
✅ Call session saved successfully: <session-id>
📝 Inserting performance metrics for session: <session-id>
✅ Performance metrics saved successfully
📝 Updating call session: <session-id>
✅ Call session updated successfully
✅ Call session updated with final data
```

### Step 4: Verify Database
Check your Supabase database to confirm data was saved:

**Option A: Using Supabase Dashboard**
1. Go to https://supabase.com/dashboard
2. Select your project
3. Click **Table Editor**
4. Check these tables:
   - `users` → Should have your user record
   - `call_sessions` → Should have 1+ rows (one per completed call)
   - `performance_metrics` → Should have 1+ rows (one per completed call)

**Option B: Using SQL Editor**
```sql
-- Check users
SELECT * FROM users;

-- Check call sessions (with user info)
SELECT cs.*, u.email 
FROM call_sessions cs 
JOIN users u ON u.id = cs.user_id 
ORDER BY cs.created_at DESC;

-- Check performance metrics (with session info)
SELECT pm.*, cs.voter_profile_id 
FROM performance_metrics pm 
JOIN call_sessions cs ON cs.id = pm.session_id 
ORDER BY pm.created_at DESC;
```

## 🐛 Troubleshooting

### Issue: "Failed to ensure user profile exists"
**Solution:**
1. Log out completely
2. Clear browser storage/cache
3. Log back in
4. The profile should be created automatically

### Issue: Still seeing database errors
**Check these:**

1. **Supabase Configuration**
   - Verify `.env.local` has correct credentials:
     ```env
     NEXT_PUBLIC_SUPABASE_URL=your_url_here
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here
     ```
   - Restart the dev server after any `.env.local` changes

2. **RLS Policies**
   - Go to Supabase Dashboard → Authentication → Policies
   - Verify policies exist for:
     - `users` table (SELECT, INSERT, UPDATE for own data)
     - `call_sessions` table (ALL for own sessions)
     - `performance_metrics` table (ALL for own sessions)
   - If missing, run `DATABASE_SCHEMA.sql` or `migrations/fix_user_rls_policies.sql`

3. **User Authentication**
   - Make sure you're actually logged in (check for user info in header)
   - Try logging out and back in
   - Check console for auth errors

### Issue: Console shows warnings instead of errors
Some warnings are expected:
- `✅ User profile already exists` → Good! Profile exists
- `Post-call-end event received (ignoring)` → Normal Vapi cleanup

## 📊 Expected Behavior

### Before Fix
- ❌ Call sessions not saved to database
- ❌ Foreign key constraint errors (user_id doesn't exist)
- ❌ Silent failures or unclear error messages
- ❌ Dashboard stats remain at 0

### After Fix
- ✅ User profile automatically created on login
- ✅ Call sessions successfully saved to `call_sessions` table
- ✅ Performance metrics saved to `performance_metrics` table
- ✅ Dashboard shows accurate call counts and stats
- ✅ Clear logging at each step for debugging
- ✅ Helpful error messages if something goes wrong

## 🔍 Files Modified

1. **`lib/auth.tsx`**
   - Enhanced user profile creation logic
   - Added profile creation on initial session load
   - Added `USER_UPDATED` event handling

2. **`lib/supabase.ts`**
   - Added `ensureUserProfile()` helper function
   - Enhanced error logging in all save functions
   - Better error propagation (throws instead of null)

3. **`app/practice/page.tsx`**
   - Added pre-save user profile validation
   - Imported and used `ensureUserProfile`
   - Added user-friendly error alerts

## ✅ Verification Checklist

Use this checklist to confirm everything works:

- [ ] User profile is created when logging in (check console)
- [ ] Call sessions save successfully (check console logs)
- [ ] Performance metrics save successfully (check console logs)
- [ ] Data appears in Supabase tables (check Table Editor)
- [ ] Dashboard shows accurate call counts
- [ ] No foreign key constraint errors
- [ ] Clear logging messages throughout the process

## 💡 Key Improvements

1. **Proactive User Creation**: User profiles are created immediately on session load, not just on sign-in
2. **Double Safety Check**: Validates user exists before attempting to save call data
3. **Better Error Handling**: Clear, structured error messages with actionable hints
4. **Comprehensive Logging**: Every step is logged with emojis for easy visual scanning
5. **User Feedback**: Alerts users if data can't be saved and suggests solutions

---

**Status**: ✅ Fixed and ready for testing

**Next Steps**: 
1. Restart dev server if needed
2. Log out and log back in
3. Complete a test call
4. Verify data in Supabase dashboard

