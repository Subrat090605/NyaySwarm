// RootApp.tsx - Place this in src/RootApp.tsx
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import AuthPage from "./AuthPage";
import App from "./App";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || "",
  import.meta.env.VITE_SUPABASE_ANON_KEY || ""
);

export default function RootApp() {
  const [user, setUser] = useState<any>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Check existing session on load
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setChecking(false);
    });

    // Listen for auth state changes (OAuth redirect, logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  // Show nothing while checking session (avoids flash)
  if (checking) return (
    <div style={{
      minHeight: "100vh", background: "#0A0A08",
      display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: "50%",
        border: "2px solid rgba(255,107,26,0.3)",
        borderTopColor: "#FF6B1A",
        animation: "spin .7s linear infinite"
      }} />
    </div>
  );

  if (!user) return <AuthPage onAuth={setUser} />;

  return <App user={user} onLogout={handleLogout} />;
}
