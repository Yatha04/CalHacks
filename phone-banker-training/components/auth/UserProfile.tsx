'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export function UserProfile() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      const { error } = await signOut();
      if (error) {
        console.error('Error signing out:', error);
        setLoading(false);
      } else {
        // Successful sign out - redirect to home page
        router.push('/');
      }
    } catch (error) {
      console.error('Error signing out:', error);
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="flex items-center gap-4 bg-gray-50 rounded-lg px-4 py-2.5 border border-gray-200 hover:border-gray-300 transition-all">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-semibold shadow-sm ring-2 ring-blue-100">
          {user.email?.charAt(0).toUpperCase()}
        </div>
        <div className="flex flex-col">
          <p className="text-sm font-semibold text-gray-900 leading-tight">
            {user.user_metadata?.full_name || user.user_metadata?.name || 'User'}
          </p>
          <p className="text-xs text-gray-600 leading-tight">
            {user.email}
          </p>
        </div>
      </div>
      <div className="h-8 w-px bg-gray-300" />
      <Button
        variant="ghost"
        size="sm"
        onClick={handleSignOut}
        disabled={loading}
        className="gap-2 text-gray-700 hover:text-red-600 hover:bg-red-50"
      >
        <LogOut className="w-4 h-4" />
        <span className="font-medium">{loading ? 'Signing out...' : 'Sign Out'}</span>
      </Button>
    </div>
  );
}
