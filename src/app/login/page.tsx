
'use client';
import { useState, useEffect } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { getFirebaseErrorMessage } from "@/lib/firebaseErrors";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "@/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      router.push('/admin');
    }
  }, [user, router]);

  if (user) {
    return null; // Render nothing while redirecting
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/admin');
    } catch (err: any) {
      const message = getFirebaseErrorMessage(err.code);
      setError(message);
      console.error("Login error:", err.code, err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      await signInWithPopup(auth, googleProvider);
      router.push('/admin');
    } catch (err: any) => {
      const message = getFirebaseErrorMessage(err.code);

      if (err.code === "auth/popup-blocked") {
        setError("Popup blocked! Please allow popups and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md bg-gray-900/80 border-purple-500/30">
        <CardHeader className="text-center">
            <CardTitle className="text-4xl font-black text-center mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Admin Login
            </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-4">
            {error && (
                <div className="mb-6 p-5 bg-red-900/50 border border-red-500/50 rounded-2xl flex items-center gap-4 w-full">
                  <AlertCircle className="w-8 h-8 text-red-400" />
                  <p className="text-lg text-red-300">{error}</p>
                </div>
            )}
            
            <form onSubmit={handleEmailLogin} className="space-y-6 w-full">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@projectx.com"
                  required
                  disabled={loading}
                  className="w-full px-6 py-5 bg-black/50 rounded-2xl text-xl focus:outline-none focus:ring-4 focus:ring-purple-500 h-auto"
                />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  disabled={loading}
                  className="w-full px-6 py-5 bg-black/50 rounded-2xl text-xl focus:outline-none focus:ring-4 focus:ring-purple-500 h-auto"
                />

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full py-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl text-2xl font-bold hover:scale-105 transition disabled:opacity-50 h-auto"
                >
                  {loading ? "Logging in..." : "Login with Email"}
                </Button>
            </form>

            <div className="my-4 text-center text-gray-500 w-full">OR</div>

            <Button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full py-6 bg-white text-black rounded-2xl text-2xl font-bold hover:scale-105 transition flex items-center justify-center gap-4 disabled:opacity-50 h-auto"
            >
                <svg className="w-8 h-8" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}
