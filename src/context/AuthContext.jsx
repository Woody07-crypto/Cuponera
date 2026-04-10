import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase/config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { fetchRoleAndProfile } from "../services/perfilService";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setRole(null);
      setProfileLoading(false);
      return;
    }

    let cancelled = false;
    setProfileLoading(true);

    (async () => {
      try {
        const { role: r, profile: p } = await fetchRoleAndProfile(
          db,
          user.uid,
          user.email
        );
        if (cancelled) return;
        setProfile(p);
        setRole(r);
      } catch {
        if (!cancelled) {
          setProfile({ id: user.uid, correo: user.email });
          setRole(null);
        }
      } finally {
        if (!cancelled) setProfileLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user]);

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider
      value={{ user, logout, loading, profile, role, profileLoading }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}
