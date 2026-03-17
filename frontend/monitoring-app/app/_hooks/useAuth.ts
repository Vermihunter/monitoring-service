import { useEffect, useState } from "react";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        console.log(`${process.env.BACKEND_URL}/api/v1/auth/me`);
        const res = await fetch(`http://localhost:8080/api/v1/auth/me`, {
          credentials: "include",
        }).then((r) => r.json());

        console.log("RES", res);

        if (res.status !== "success") {
          setUser(null);
          return;
        }

        setUser(res.data.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  return { user, loading, isAuthenticated: !!user };
}
