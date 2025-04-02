
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Define the specific admin UID
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
  const [isLoading, setIsLoading] = useState(true); // Start as loading
  const [isAdmin, setIsAdmin] = useState(false);

  // Simple profile fetcher - optimized
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
      if (userId === ADMIN_UID) {
        // Ensure admin is set even if profile fetch fails
        setIsAdmin(true);
      }
      return null;
    }
  };

  const refreshProfile = async () => {
    if (user) await fetchProfile(user.id);
  };

  // Initialize auth on component mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // First set up the listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, newSession) => {
            setSession(newSession);
            setUser(newSession?.user ?? null);
            
            // Important: Set admin status immediately for known admin UID
            if (newSession?.user?.id === ADMIN_UID) {
              setIsAdmin(true);
            }
            
            // Then fetch profile if needed
            if (newSession?.user) {
              // Defer this to prevent blocking main thread
              setTimeout(() => {
                fetchProfile(newSession.user.id);
              }, 0);
            } else {
              setProfile(null);
              setIsAdmin(false);
            }
            setIsLoading(false);
          }
        );

        // Then check for existing session
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (currentSession) {
          setSession(currentSession);
          setUser(currentSession.user);
          
          // Set admin immediately for known admin
          if (currentSession.user?.id === ADMIN_UID) {
            setIsAdmin(true);
          }
          
          await fetchProfile(currentSession.user.id);
        }
        
        // Done loading regardless of result
        setIsLoading(false);
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Auth initialization error:', error);
        setIsLoading(false); // Always turn off loading even on error
      }
    };

    initializeAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Success handling
      setSession(data.session);
      setUser(data.user);
      
      // Set admin status immediately for known admin
      if (data.user?.id === ADMIN_UID) {
        setIsAdmin(true);
        toast.success('Welcome, Admin!');
      } else {
        toast.success('Login successful!');
      }
      
      // Fetch profile after successful login
      await fetchProfile(data.user.id);
      
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
