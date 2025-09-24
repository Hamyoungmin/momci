'use client';

import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface SubscriptionState {
  hasActiveSubscription: boolean;
  subscriptionType: 'parent' | 'therapist' | 'none';
  loading: boolean;
}

export function useSubscriptionStatus(userId?: string | null): SubscriptionState {
  const [state, setState] = useState<SubscriptionState>({
    hasActiveSubscription: false,
    subscriptionType: 'none',
    loading: true,
  });

  useEffect(() => {
    if (!userId) {
      setState({ hasActiveSubscription: false, subscriptionType: 'none', loading: false });
      return;
    }

    const unsub = onSnapshot(doc(db, 'user-subscription-status', userId), (snap) => {
      if (snap.exists()) {
        const data = snap.data() as { hasActiveSubscription?: boolean; subscriptionType?: 'parent' | 'therapist' | 'none' };
        setState({
          hasActiveSubscription: !!data?.hasActiveSubscription,
          subscriptionType: (data?.subscriptionType || 'none') as 'parent' | 'therapist' | 'none',
          loading: false,
        });
      } else {
        setState({ hasActiveSubscription: false, subscriptionType: 'none', loading: false });
      }
    }, () => setState(prev => ({ ...prev, loading: false })));

    return () => unsub();
  }, [userId]);

  return state;
}


