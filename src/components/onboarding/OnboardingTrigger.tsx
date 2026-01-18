
'use client';

import { useUser } from '@/firebase';
import { useOnboardingStore } from '@/store/onboarding-store';
import { useEffect } from 'react';

export default function OnboardingTrigger() {
    const { userProfile, loading } = useUser();
    const { open, isOpen } = useOnboardingStore();
    
    useEffect(() => {
        if (!loading && userProfile && userProfile.onboardingCompleted === false && !isOpen) {
            open();
        }
    }, [userProfile, loading, open, isOpen]);

    // This component renders nothing
    return null;
}
