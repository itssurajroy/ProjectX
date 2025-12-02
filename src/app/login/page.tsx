
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth, initiateEmailSignIn, initiateEmailSignUp, initiateAnonymousSignIn } from '@/firebase';
import { useRouter } from 'next/navigation';
import { FirebaseError } from 'firebase/app';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { X } from 'lucide-react';

export default function LoginPage() {
  const auth = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuthAction = async (action: 'signIn' | 'signUp' | 'anonymous') => {
    setLoading(true);
    try {
      if (action === 'anonymous') {
        await initiateAnonymousSignIn(auth);
      } else if (action === 'signIn') {
        await initiateEmailSignIn(auth, email, password);
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
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Tabs defaultValue="login" className="w-[400px] relative">
        <Link href="/home" className="absolute top-4 right-4 text-muted-foreground hover:text-foreground z-10">
            <X className="w-5 h-5" />
        </Link>
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
              <div className="space-y-2">
                <Label htmlFor="email-login">Email</Label>
                <Input id="email-login" type="email" placeholder="m@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-login">Password</Label>
                <Input id="password-login" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <Button onClick={() => handleAuthAction('signIn')} disabled={loading} className="w-full">
                {loading ? 'Logging in...' : 'Login'}
              </Button>
               <Button variant="outline" onClick={() => handleAuthAction('anonymous')} disabled={loading} className="w-full">
                {loading ? 'Signing in...' : 'Continue as Guest'}
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
              <div className="space-y-2">
                <Label htmlFor="email-signup">Email</Label>
                <Input id="email-signup" type="email" placeholder="m@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-signup">Password</Label>
                <Input id="password-signup" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <Button onClick={() => handleAuthAction('signUp')} disabled={loading} className="w-full">
                {loading ? 'Creating account...' : 'Sign Up'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
