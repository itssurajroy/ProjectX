

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, KeyRound, Mail, Lock, X, Facebook, Twitter } from 'lucide-react';
import toast from 'react-hot-toast';
import SiteLogo from '@/components/layout/SiteLogo';
import ProgressiveImage from '@/components/ProgressiveImage';
import Link from 'next/link';
import { getFirebaseErrorMessage } from '@/lib/firebaseErrors';
import { useAuth } from '@/firebase/provider';
import { GoogleAuthProvider, FacebookAuthProvider, TwitterAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const twitterProvider = new TwitterAuthProvider();

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

  const handleAuthAction = (action: 'login' | 'signup') => {
    setIsLoading(true);
    setError(null);
    const toastId = toast.loading(action === 'login' ? 'Logging in...' : 'Signing up...');

    const authPromise = action === 'login'
      ? signInWithEmailAndPassword(auth, email, password)
      : createUserWithEmailAndPassword(auth, email, password);

    authPromise
      .then(userCredential => {
        toast.success('Success! Redirecting...', { id: toastId });
        router.push('/dashboard');
      })
      .catch(e => {
        const errorMessage = getFirebaseErrorMessage(e.code);
        setError(errorMessage);
        toast.error(errorMessage, { id: toastId });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleOAuthSignIn = (provider: GoogleAuthProvider | FacebookAuthProvider | TwitterAuthProvider) => {
    setIsLoading(true);
    setError(null);

    let providerName = 'provider';
    if (provider.providerId === 'google.com') providerName = 'Google';
    if (provider.providerId === 'facebook.com') providerName = 'Facebook';
    if (provider.providerId === 'twitter.com') providerName = 'Twitter';

    const toastId = toast.loading(`Waiting for ${providerName}...`);

    signInWithPopup(auth, provider)
      .then(result => {
        toast.success(`Logged in with ${providerName}!`, { id: toastId });
        router.push('/dashboard');
      })
      .catch(e => {
        const errorMessage = getFirebaseErrorMessage(e.code);
        setError(errorMessage);
        toast.error(errorMessage, { id: toastId });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background p-4 overflow-hidden">
      <div className="absolute inset-0 z-0">
          <ProgressiveImage
              src="https://picsum.photos/seed/login-bg/1920/1080"
              alt="Login background"
              fill
              className="object-cover opacity-20 blur-sm"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-background/50 via-background to-background" />
      </div>
      
      <Tabs defaultValue="login" className="w-full max-w-md z-10 relative">
        <Link href="/home" passHref>
            <Button variant="ghost" size="icon" className="absolute top-4 right-4 z-20 text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
            </Button>
        </Link>
        <div className="flex justify-center mb-8">
            <SiteLogo />
        </div>

        <Card className="bg-card/50 backdrop-blur-lg border-border/50">
            <TabsList className="grid w-full grid-cols-2 bg-muted/50">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
                <CardHeader>
                    <CardTitle>Welcome Back</CardTitle>
                    <CardDescription>Sign in to continue your anime journey.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input id="login-email" type="email" placeholder="m@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="pl-10" />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input id="login-password" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="pl-10"/>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <Button onClick={() => handleAuthAction('login')} disabled={isLoading} className="w-full">
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <KeyRound className="mr-2 h-4 w-4" />} Login
                    </Button>
                    <div className="relative w-full">
                        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border/50" /></div>
                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Or continue with</span></div>
                    </div>
                     <div className="w-full grid grid-cols-1 gap-2">
                        <Button variant="secondary" onClick={() => handleOAuthSignIn(googleProvider)} disabled={isLoading} className="w-full">
                           {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon /> }
                            Google
                        </Button>
                        <Button variant="secondary" onClick={() => handleOAuthSignIn(facebookProvider)} disabled={isLoading} className="w-full bg-[#1877F2] text-white hover:bg-[#1877F2]/90">
                           {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Facebook className="mr-2 h-4 w-4" /> }
                            Facebook
                        </Button>
                        <Button variant="secondary" onClick={() => handleOAuthSignIn(twitterProvider)} disabled={isLoading} className="w-full bg-[#1DA1F2] text-white hover:bg-[#1DA1F2]/90">
                           {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Twitter className="mr-2 h-4 w-4" /> }
                            Twitter
                        </Button>
                    </div>
                </CardFooter>
            </TabsContent>

            <TabsContent value="signup">
                <CardHeader>
                    <CardTitle>Create an Account</CardTitle>
                    <CardDescription>Join Project X to track your anime and more.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input id="signup-email" type="email" placeholder="m@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="pl-10"/>
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input id="signup-password" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="pl-10"/>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <Button onClick={() => handleAuthAction('signup')} disabled={isLoading} className="w-full">
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <KeyRound className="mr-2 h-4 w-4" />} Sign Up
                    </Button>
                    <div className="relative w-full">
                        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border/50" /></div>
                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Or sign up with</span></div>
                    </div>
                    <div className="w-full grid grid-cols-1 gap-2">
                        <Button variant="secondary" onClick={() => handleOAuthSignIn(googleProvider)} disabled={isLoading} className="w-full">
                           {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon /> }
                            Google
                        </Button>
                         <Button variant="secondary" onClick={() => handleOAuthSignIn(facebookProvider)} disabled={isLoading} className="w-full bg-[#1877F2] text-white hover:bg-[#1877F2]/90">
                           {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Facebook className="mr-2 h-4 w-4" /> }
                            Facebook
                        </Button>
                        <Button variant="secondary" onClick={() => handleOAuthSignIn(twitterProvider)} disabled={isLoading} className="w-full bg-[#1DA1F2] text-white hover:bg-[#1DA1F2]/90">
                           {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Twitter className="mr-2 h-4 w-4" /> }
                            Twitter
                        </Button>
                    </div>
                </CardFooter>
            </TabsContent>
        </Card>
        {error && <p className="text-center text-sm text-destructive mt-4">{error}</p>}
      </Tabs>
    </div>
  );
}

    