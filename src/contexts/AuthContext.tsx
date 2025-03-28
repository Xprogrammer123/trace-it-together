import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      setProfile(data);
      setIsAdmin(data.role === 'admin' || userId === ADMIN_UID);
      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  };

  const refreshProfile = async () => {
    if (user) await fetchProfile(user.id);
  };

  useEffect(() => {
    setIsLoading(true);

    const initializeAuth = async () => {
      const { data: { session: currentSession }, error } = await supabase.auth.getSession();
      console.log('Initial session:', currentSession, 'Error:', error?.message);
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user) {
        if (currentSession.user.id === ADMIN_UID) {
          setIsAdmin(true);
        }
        await fetchProfile(currentSession.user.id);
      }
      setIsLoading(false);
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('Auth state changed:', event, newSession);
        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (newSession?.user) {
          if (newSession.user.id === ADMIN_UID) {
            setIsAdmin(true);
          }
          await fetchProfile(newSession.user.id);
        } else {
          setProfile(null);
          setIsAdmin(false);
        }

        setIsLoading(false);
      }
    );

    const checkStorage = () => {
      const sessionData = localStorage.getItem('supabase.auth.token');
      console.log('Session in localStorage:', sessionData ? JSON.parse(sessionData) : null);
    };
    checkStorage();
    const interval = setInterval(checkStorage, 5000);

    return () => {
      subscription.unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting sign in with:', { email, password });
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      console.log('Sign in response:', data);
      setSession(data.session);
      setUser(data.user);

      // Verify session is set in localStorage
      const storedSession = localStorage.getItem('supabase.auth.token');
      console.log('Session stored after signIn:', storedSession ? JSON.parse(storedSession) : null);

      if (data.user?.id === ADMIN_UID) {
        toast.success('Welcome, Admin! Redirecting to dashboard...');
      } else {
        toast.success('Login successful! Redirecting to dashboard...');
      }

      return { success: true };
    } catch (error: any) {
      console.error('Sign in error:', error.message);
      return {
        success: false,
        error: error.message || 'Login failed',
      };
    }
  };

  const signUp = async (email: string, password: string, metadata?: { full_name?: string }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: metadata },
      });

      if (error) throw error;

      console.log('Sign up successful:', data);
      return { success: true };
    } catch (error: any) {
      console.error('Sign up error:', error.message);
      return {
        success: false,
        error: error.message || 'Signup failed',
      };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setSession(null);
      setUser(null);
      setProfile(null);
      setIsAdmin(false);
      console.log('Signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
    }
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
        refreshProfile,
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
  const adminEmail = 'adminpage@gmail.com'; // Replace with a valid, unique email
  const adminPassword = 'adminpage@12345';

  const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
    email: adminEmail,
    password: adminPassword,
  });

  if (!signInError && user) {
    console.log('Admin user already exists');
    return;
  }

  const { data, error } = await supabase.auth.signUp({
    email: adminEmail,
    password: adminPassword,
    options: { data: { full_name: 'Admin User' } },
  });

  if (error) {
    console.error('Error creating admin user:', error.message);
    return;
  }

  if (data.user) {
    const { error: roleError } = await supabase
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', data.user.id);

    if (roleError) {
      console.error('Error setting admin role:', roleError.message);
    } else {
      console.log('Admin user created and role set');
    }
  }
};
