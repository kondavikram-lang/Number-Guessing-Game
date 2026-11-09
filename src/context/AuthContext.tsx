import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  playerName: string;
  loading: boolean;
  isConfigured: boolean;
  supabaseError: string | null;
  clearSupabaseError: () => void;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, playerName: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  updatePlayerName: (name: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [playerName, setPlayerName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [supabaseError, setSupabaseError] = useState<string | null>(null);

  const clearSupabaseError = () => setSupabaseError(null);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        setSupabaseError(error.message);
      } else {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          const storedName = session.user.user_metadata?.player_name || session.user.email?.split('@')[0] || 'Player';
          setPlayerName(storedName);
        }
      }
      setLoading(false);
    }).catch((err: Error) => {
      setSupabaseError(err.message || 'Failed to initialize Supabase session');
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        const storedName = session.user.user_metadata?.player_name || session.user.email?.split('@')[0] || 'Player';
        setPlayerName(storedName);
      } else {
        setPlayerName('');
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setSupabaseError(null);
    if (!supabase) {
      const msg = 'Supabase is not configured. Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY.';
      setSupabaseError(msg);
      return { success: false, error: msg };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setSupabaseError(error.message);
        return { success: false, error: error.message };
      }

      const name = data.user.user_metadata?.player_name || data.user.email?.split('@')[0] || 'Player';
      setPlayerName(name);
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setSupabaseError(msg);
      return { success: false, error: msg };
    }
  };

  const signUp = async (email: string, password: string, customPlayerName: string) => {
    setSupabaseError(null);
    if (!supabase) {
      const msg = 'Supabase is not configured. Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY.';
      setSupabaseError(msg);
      return { success: false, error: msg };
    }

    try {
      const trimmedName = customPlayerName.trim() || email.split('@')[0] || 'Player';
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            player_name: trimmedName,
          },
        },
      });

      if (error) {
        setSupabaseError(error.message);
        return { success: false, error: error.message };
      }

      if (data.user) {
        setPlayerName(trimmedName);
      }
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setSupabaseError(msg);
      return { success: false, error: msg };
    }
  };

  const signOut = async () => {
    setSupabaseError(null);
    if (!supabase) return;
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        setSupabaseError(error.message);
      }
      setUser(null);
      setSession(null);
      setPlayerName('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setSupabaseError(msg);
    }
  };

  const updatePlayerName = (name: string) => {
    setPlayerName(name);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        playerName,
        loading,
        isConfigured: isSupabaseConfigured,
        supabaseError,
        clearSupabaseError,
        signIn,
        signUp,
        signOut,
        updatePlayerName,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
