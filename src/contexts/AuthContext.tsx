
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, login, logout } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { toast } from 'sonner';

type AuthContextType = {
  currentUser: User | null;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsAdmin(!!user); // For now, any logged in user is admin
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const loginWithToast = async (email: string, password: string) => {
    try {
      await login(email, password);
      toast.success("Login berhasil! Selamat datang admin kece 😎");
    } catch (error) {
      toast.error("Gagal login! Email/password salah, atau kamu bukan admin 🤨");
      throw error;
    }
  };

  const logoutWithToast = async () => {
    try {
      await logout();
      toast.success("Logout berhasil! Dadah admin 👋");
    } catch (error) {
      toast.error("Gagal logout! Coba lagi ya 🙏");
      throw error;
    }
  };

  const value = {
    currentUser,
    isAdmin,
    loading,
    login: loginWithToast,
    logout: logoutWithToast,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
