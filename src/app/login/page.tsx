
'use client';

import { useState } from 'react';
import { useAuth } from '@/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getFirebaseErrorMessage } from '@/lib/firebaseErrors';
import { Loader2, KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';
import SiteLogo from '@/components/layout/SiteLogo';

const GoogleIcon = () => (
    <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
        <path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512S0 403.3 0 261.8 106.5 11.8 244 11.8S488 120.3 488 261.8zm-252.3 86.2c-2.3 15.3-6.1 30.5-12.7 44.4-15.3 32.1-39.2 57.7-69.3 75.3-26.1 15.3-56.5 24.4-89.3 25.3-33.8 1-67.7-5.1-98-19.5-32.1-15.3-57.7-39.2-75.3-69.3-17.6-30-26.1-63.1-25.3-97.1 1-33.8 10.2-67.7 25.3-98 15.3-32.1 39.2-57.7 69.3-75.3 30-17.6 63.1-26.1 97.1-25.3 33.8-1 67.7 5.1 98 19.5 32.1 15.3 57.7 39.2 75.3 69.3 17.6 30 26.1 63.1 25.3 97.1z"></path>
    </svg>
)

export default function LoginPage() {
  const auth = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuthAction = async (action: 'login' | 'signup') => {
    if (!auth) {
        toast.error("Authentication service is not available.");
        return;
    }
    setIsLoading(true);
    setError(null);
    try {
      if (action === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      toast.success(action === 'login' ? 'Successfully signed in!' : 'Account created successfully!');
      router.push('/dashboard');
    } catch (err: any) {
      const friendlyError = getFirebaseErrorMessage(err.code);
      setError(friendlyError);
      toast.error(friendlyError);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!auth) {
        toast.error("Authentication service is not available.");
        return;
    }
    setIsLoading(true);
    setError(null);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast.success('Successfully signed in with Google!');
      router.push('/dashboard');
    } catch (err: any) {
      const friendlyError = getFirebaseErrorMessage(err.code);
      setError(friendlyError);
      toast.error(friendlyError);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Tabs defaultValue="login" className="w-full max-w-md">
        <div className="flex justify-center mb-6">
            <SiteLogo />
        </div>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Welcome Back</CardTitle>
              <CardDescription>Sign in to continue your anime journey.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input id="login-email" type="email" placeholder="m@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <Input id="login-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button onClick={() => handleAuthAction('login')} disabled={isLoading} className="w-full">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <KeyRound className="mr-2 h-4 w-4" />} Login
              </Button>
              <div className="relative w-full">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                  <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">Or continue with</span></div>
              </div>
              <Button variant="outline" onClick={handleGoogleSignIn} disabled={isLoading} className="w-full">
                <GoogleIcon /> Google
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle>Create an Account</CardTitle>
              <CardDescription>Join Project X to track your anime and more.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input id="signup-email" type="email" placeholder="m@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input id="signup-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
            </CardContent>
             <CardFooter className="flex flex-col gap-4">
              <Button onClick={() => handleAuthAction('signup')} disabled={isLoading} className="w-full">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <KeyRound className="mr-2 h-4 w-4" />} Sign Up
              </Button>
               <div className="relative w-full">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                  <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">Or sign up with</span></div>
              </div>
              <Button variant="outline" onClick={handleGoogleSignIn} disabled={isLoading} className="w-full">
                <GoogleIcon /> Google
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        {error && <p className="text-center text-sm text-destructive mt-4">{error}</p>}
      </Tabs>
    </div>
  );
}
