
'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useOnboardingStore } from '@/store/onboarding-store';
import { Button } from '@/components/ui/button';
import { useUser, useFirestore, updateDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import SiteLogo from '../layout/SiteLogo';

const WelcomeStep = () => {
    const { nextStep } = useOnboardingStore();
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
        >
            <DialogTitle className="text-3xl font-bold text-glow">Welcome, Sorcerer</DialogTitle>
            <DialogDescription className="mt-2 text-lg">
                Your domain is ready to expand. Let's personalize your experience.
            </DialogDescription>
            <Button onClick={nextStep} size="lg" className="mt-8">
                Begin The Ritual
            </Button>
        </motion.div>
    )
}

// Placeholder for the next step
const ProfileStep = () => {
    const { close } = useOnboardingStore();
    const { user } = useUser();
    const firestore = useFirestore();

    const handleFinish = async () => {
        if (user) {
            const userRef = doc(firestore, 'users', user.uid);
            updateDocumentNonBlocking(userRef, { onboardingCompleted: true });
            toast.success("Setup complete! Your domain has expanded.");
        }
        close();
    }
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
        >
            <DialogTitle className="text-3xl font-bold">Profile Setup</DialogTitle>
            <DialogDescription className="mt-2 text-lg">
                This is where you'll set your username, avatar, and favorite genres.
            </DialogDescription>
            <p className="text-muted-foreground text-sm mt-4">(This part is coming soon!)</p>
            <Button onClick={handleFinish} size="lg" className="mt-8">
                Finish for now
            </Button>
        </motion.div>
    )
}


export default function OnboardingWizard() {
  const { isOpen, close, step } = useOnboardingStore();

  const handleOpenChange = (open: boolean) => {
      if (!open) {
          // Prevent closing via overlay click for now
          // In a real scenario, you might ask for confirmation
          return;
      }
  }

  const renderStep = () => {
      switch(step) {
          case 1:
              return <WelcomeStep />;
          case 2:
              return <ProfileStep />;
          default:
              return <WelcomeStep />;
      }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-background border-primary/30 max-w-md mx-auto">
        <DialogHeader className="items-center mb-4">
            <SiteLogo />
        </DialogHeader>
        {renderStep()}
      </DialogContent>
    </Dialog>
  );
}
