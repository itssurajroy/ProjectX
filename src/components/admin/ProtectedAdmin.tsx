
'use client';
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/firebase";
import Loading from "@/app/loading";

export default function ProtectedAdmin({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    // If the auth state is resolved and there's still no user, redirect to login.
    if (!isUserLoading && !user) {
      router.replace("/login");
    }
  }, [user, isUserLoading, router]);

  // While checking the user's auth state, show a loading screen.
  if (isUserLoading) {
    return <Loading />;
  }

  // If there is a user, render the admin content.
  if (user) {
    return <>{children}</>;
  }

  // If no user and not loading (i.e., about to redirect), render nothing to prevent flashes of content.
  return null;
}
