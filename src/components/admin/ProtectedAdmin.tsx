
'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { useAuth } from "@/firebase";
import Loading from "@/app/loading";

export default function ProtectedAdmin({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const auth = useAuth(); // Use hook
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // Not logged in → redirect to your login page
        router.replace("/login"); // change "/login" to your actual login route
        return;
      }

      // OPTIONAL: extra check if you only want specific users
      // const allowedUIDs = ["your-uid-here", "another-admin-uid"];
      // if (!allowedUIDs.includes(user.uid)) {
      //   router.replace("/");
      //   return;
      // }

      setAllowed(true);
      setLoading(false);
    });

    return () => unsub();
  }, [router, auth]);

  if (loading) {
    return <Loading />; // full-screen loader
  }

  if (!allowed) {
    return null; // will be redirected anyway
  }

  return <>{children}</>;
}
