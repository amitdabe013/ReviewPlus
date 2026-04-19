import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

const fmt = (u) => u ? ({
  id: u.id,
  email: u.email,
  name: u.user_metadata?.name,
  businessName: u.user_metadata?.business_name,
}) : null;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(fmt(session?.user));
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(fmt(session?.user));
    });

    return () => subscription.unsubscribe();
  }, []);

  const logout = () => supabase.auth.signOut();

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
