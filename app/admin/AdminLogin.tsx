'use client';

import { createClient } from '@/lib/supabase/client';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function AdminLogin() {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleSignIn = async () => {
    setLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          next: '/admin'
        }
      },
    });
  };

  return (
    <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100">
        Admin Login
      </h1>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
        Please sign in securely to access the administration panel.
      </p>
      
      <button
        onClick={handleSignIn}
        disabled={loading}
        className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="animate-spin h-5 w-5 mr-3" />
        ) : (
            <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
               <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
            </svg>
        )}
        Sign in with Google
      </button>
    </div>
  );
}
