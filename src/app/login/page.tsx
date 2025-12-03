
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth, initiateEmailSignIn, initiateEmailSignUp, initiateAnonymousSignIn, initiateGoogleSignIn } from '@/firebase';
import { useRouter } from 'next/navigation';
import { FirebaseError } from 'firebase/app';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { X } from 'lucide-react';

const GoogleIcon = () => (
    <svg className="w-4 h-4 mr-2" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
    </svg>
);


export default function LoginPage() {
  const auth = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [authAction, setAuthAction] = useState<'signIn' | 'signUp' | 'anonymous' | 'google' | null>(null);

  const handleAuthAction = async (action: 'signIn' | 'signUp' | 'anonymous' | 'google') => {
    setLoading(true);
    setAuthAction(action);
    try {
      if (action === 'anonymous') {
        await initiateAnonymousSignIn(auth);
      } else if (action === 'signIn') {
        await initiateEmailSignIn(auth, email, password);
      } else if (action === 'google') {
        await initiateGoogleSignIn(auth);
      } else {
        await initiateEmailSignUp(auth, email, password);
      }
      toast.success("Redirecting...");
      router.push('/home');
    } catch (error) {
      if (error instanceof FirebaseError) {
        if (error.code === 'auth/invalid-credential') {
            toast.error('Invalid email or password.');
        } else {
            toast.error(error.message);
        }
      } else {
        toast.error('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
      setAuthAction(null);
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-md relative">
        <Link href="/home" className="absolute top-4 right-4 text-muted-foreground hover:text-foreground z-10">
            <X className="w-5 h-5" />
        </Link>
        <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
            <Card>
                <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>Access your account to continue.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full" onClick={() => handleAuthAction('google')} disabled={loading}>
                      {loading && authAction === 'google' ? 'Signing in...' : <><GoogleIcon /> Sign in with Google</>}
                  </Button>
                  <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                      </div>
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="email-login">Email</Label>
                      <Input id="email-login" type="email" placeholder="m@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="password-login">Password</Label>
                      <Input id="password-login" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                  </div>
                  <Button onClick={() => handleAuthAction('signIn')} disabled={loading} className="w-full">
                      {loading && authAction === 'signIn' ? 'Logging in...' : 'Login'}
                  </Button>
                  <Button variant="outline" onClick={() => handleAuthAction('anonymous')} disabled={loading} className="w-full">
                      {loading && authAction === 'anonymous' ? 'Signing in...' : 'Continue as Guest'}
                  </Button>
                </CardContent>
            </Card>
            </TabsContent>
            <TabsContent value="signup">
            <Card>
                <CardHeader>
                <CardTitle>Sign Up</CardTitle>
                <CardDescription>Create a new account to get started.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full" onClick={() => handleAuthAction('google')} disabled={loading}>
                      {loading && authAction === 'google' ? 'Signing up...' : <><GoogleIcon /> Sign up with Google</>}
                  </Button>
                  <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-card px-2 text-muted-foreground">Or sign up with email</span>
                      </div>
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="email-signup">Email</Label>
                      <Input id="email-signup" type="email" placeholder="m@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="password-signup">Password</Label>
                      <Input id="password-signup" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                  </div>
                  <Button onClick={() => handleAuthAction('signUp')} disabled={loading} className="w-full">
                      {loading && authAction === 'signUp' ? 'Creating account...' : 'Sign Up'}
                  </Button>
                </CardContent>
            </Card>
            </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
