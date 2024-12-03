import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { auth, signInWithGoogle, signOutUser, handleRedirectResult } from '@/lib/firebase';
import { User, onAuthStateChanged } from 'firebase/auth';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<User | null>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => null,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const handleAuthStateChanged = useCallback((currentUser: User | null) => {
    setUser(currentUser);
    setLoading(false);
  }, []);

  // Handle initial auth state and redirect results
  useEffect(() => {
    const checkRedirectResult = async () => {
      try {
        const redirectUser = await handleRedirectResult();
        if (redirectUser) {
          setUser(redirectUser);
          toast({
            title: "Success",
            description: "Successfully signed in!",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to complete sign-in. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    // Check for redirect result first
    checkRedirectResult();

    // Then set up auth state listener
    const unsubscribe = onAuthStateChanged(auth, handleAuthStateChanged);

    return () => {
      unsubscribe();
    };
  }, [handleAuthStateChanged, toast]);

  const signIn = async () => {
    try {
      setLoading(true);
      const result = await signInWithGoogle();
      
      if (result) {
        setUser(result);
        toast({
          title: "Success",
          description: "Successfully signed in!",
        });
        return result;
      }
      
      // For mobile redirect, we'll return null and handle the result in useEffect
      return null;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign in. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      // Only set loading to false for popup sign-in
      // For redirect, we keep loading true until redirect completes
      if (!/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
        setLoading(false);
      }
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await signOutUser();
      setUser(null);
      toast({
        title: "Success",
        description: "Successfully signed out!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
