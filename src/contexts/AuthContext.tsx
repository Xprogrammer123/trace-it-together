
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const ADMIN_UID = 'd14ac157-3e21-4b6e-89ea-ba40f842d6d4';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: any | null;
  isLoading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

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
      console.log('Profile fetched:', data, 'isAdmin:', data.role === 'admin' || userId === ADMIN_UID);
      
      // Navigate to admin dashboard if admin
      if (data.role === 'admin' || userId === ADMIN_UID) {
        navigate('/admin');
      }
      
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
    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        console.log('Initial session:', currentSession, 'Error:', error?.message);

        if (currentSession) {
          setSession(currentSession);
          setUser(currentSession.user);
          if (currentSession.user.id === ADMIN_UID) {
            setIsAdmin(true);
            navigate('/admin');
          }
          await fetchProfile(currentSession.user.id);
        } else {
          setSession(null);
          setUser(null);
          setProfile(null);
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Authentication initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('Auth state changed:', event, newSession);
        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (newSession) {
          try {
            localStorage.setItem('supabase.auth.token', JSON.stringify({
              access_token: newSession.access_token,
              refresh_token: newSession.refresh_token,
              expires_in: newSession.expires_in,
              expires_at: newSession.expires_at,
              token_type: newSession.token_type,
            }));
            console.log('Manually stored session in localStorage');
          } catch (e) {
            console.error('Failed to manually store session:', e);
          }
          if (newSession.user) {
            if (newSession.user.id === ADMIN_UID) {
              setIsAdmin(true);
              navigate('/admin');
            }
            await fetchProfile(newSession.user.id);
          }
        } else {
          localStorage.removeItem('supabase.auth.token');
          setProfile(null);
          setIsAdmin(false);
        }
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log('Attempting sign in with:', { email, password });
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      console.log('Sign in response:', data);
      setSession(data.session);
      setUser(data.user);

      try {
        localStorage.setItem('supabase.auth.token', JSON.stringify({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          expires_in: data.session.expires_in,
          expires_at: data.session.expires_at,
          token_type: data.session.token_type,
        }));
        console.log('Manually stored session after signIn');
      } catch (e) {
        console.error('Failed to manually store session after signIn:', e);
      }

      if (data.user?.id === ADMIN_UID) {
        toast.success('Welcome, Admin!');
        setIsAdmin(true);
        await fetchProfile(data.user.id); // Wait for profile to be fetched before navigation
      } else {
        toast.success('Login successful!');
        await fetchProfile(data.user.id); // Wait for profile to be fetched
      }

      return { success: true };
    } catch (error: any) {
      console.error('Sign in error:', error.message);
      return {
        success: false,
        error: error.message || 'Login failed',
      };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setSession(null);
      setUser(null);
      setProfile(null);
      setIsAdmin(false);
      localStorage.removeItem('supabase.auth.token');
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
