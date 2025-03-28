import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Define the specific admin UID that should always be recognized as admin
const ADMIN_UID = 'd14ac157-3e21-4b6e-89ea-ba40f842d6d4';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: any | null;
  isLoading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, metadata?: { full_name?: string }) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Fetch user profile from the profiles table
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      if (data) {
        setProfile(data);
        // Check if user is admin either by role or by matching the specific admin UID
        setIsAdmin(data.role === 'admin' || userId === ADMIN_UID);
      }
      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  // Initialize auth state
  useEffect(() => {
    setIsLoading(true);

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);

        // Use setTimeout to prevent potential deadlocks with Supabase auth
        if (newSession?.user) {
          setTimeout(() => {
            // If user is the specific admin, set isAdmin true immediately
            if (newSession.user.id === ADMIN_UID) {
              setIsAdmin(true);
            }
            fetchProfile(newSession.user.id);
          }, 0);
        } else {
          setProfile(null);
          setIsAdmin(false);
        }

        if (event === 'SIGNED_OUT') {
          setProfile(null);
          setIsAdmin(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user) {
        // If user is the specific admin, set isAdmin true immediately
        if (currentSession.user.id === ADMIN_UID) {
          setIsAdmin(true);
        }
        fetchProfile(currentSession.user.id);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      // If the user logging in is our specific admin, set a success toast
      if (data.user?.id === ADMIN_UID) {
        toast.success("Welcome, Admin! Redirecting to dashboard...");
      } else {
        toast.success("Login successful!");
      }
      
      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.message || 'Login failed' 
      };
    }
  };

  const signUp = async (email: string, password: string, metadata?: { full_name?: string }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });

      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.message || 'Signup failed' 
      };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        isLoading,
        isAdmin,
        signIn,
        signUp,
        signOut,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const createAdminUser = async () => {
  const adminEmail = 'admin@example.com';
  const adminPassword = 'admin123';

  // Check if admin exists
  const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
    email: adminEmail,
    password: adminPassword,
  });

  if (!signInError && user) {
    // Admin already exists
    return;
  }

  // Create admin user
  const { data, error } = await supabase.auth.signUp({
    email: adminEmail,
    password: adminPassword,
    options: {
      data: {
        full_name: 'Admin User',
      },
    },
  });

  if (error) {
    console.error('Error creating admin user:', error);
    return;
  }

  // Set admin role directly in database
  if (data.user) {
    const { error: roleError } = await supabase
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', data.user.id);

    if (roleError) {
      console.error('Error setting admin role:', roleError);
    }
  }
};
