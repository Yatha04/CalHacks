'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-semibold shadow-sm ring-2 ring-blue-100">
            {user.email?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-gray-900">
              {user.user_metadata?.full_name || user.user_metadata?.name || 'User'}
            </p>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>
        </div>
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
    </Card>
  );
}
