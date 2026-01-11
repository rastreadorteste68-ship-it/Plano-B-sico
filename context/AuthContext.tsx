
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthState, UserProfile, UserRole } from '../types';
import { firebaseService } from '../services/firebase';

interface AuthContextType extends AuthState {
  signIn: (email: string, pass: string) => Promise<void>;
  signUp: (data: { name: string, email: string, role: UserRole, password?: string }) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const stored = localStorage.getItem('checkmaster_session');
    if (stored) {
      try {
        setState({ user: JSON.parse(stored), loading: false, error: null });
      } catch (e) {
        setState({ user: null, loading: false, error: null });
      }
    } else {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const signIn = async (email: string, pass: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const user = await firebaseService.login(email, pass);
      localStorage.setItem('checkmaster_session', JSON.stringify(user));
      setState({ user, loading: false, error: null });
    } catch (err: any) {
      setState(prev => ({ ...prev, loading: false, error: err.message }));
      throw err;
    }
  };

  const signUp = async (data: { name: string, email: string, role: UserRole, password?: string }) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const user = await firebaseService.register(data);
      localStorage.setItem('checkmaster_session', JSON.stringify(user));
      setState({ user, loading: false, error: null });
    } catch (err: any) {
      setState(prev => ({ ...prev, loading: false, error: err.message }));
      throw err;
    }
  };

  const signOut = () => {
    localStorage.removeItem('checkmaster_session');
    setState({ user: null, loading: false, error: null });
  };

  return (
    <AuthContext.Provider value={{ ...state, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
