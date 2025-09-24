'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscriptionStatus } from '@/hooks/useSubscriptionStatus';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  requiredType: 'parent' | 'therapist';
  children: React.ReactNode;
  inactiveHint?: string;
}

export default function SubscriptionGuardButton({ requiredType, children, inactiveHint = '이용권이 없을 때는 이용권을 구매후 사용해주세요.', disabled, ...rest }: Props) {
  const { currentUser, userData } = useAuth();
  const { hasActiveSubscription, subscriptionType, loading } = useSubscriptionStatus(currentUser?.uid);

  const isWrongRole = !!userData && userData.userType !== requiredType;
  const isInactive = !loading && (!hasActiveSubscription || subscriptionType !== requiredType);
  const shouldDisable = disabled || isWrongRole || isInactive;

  return (
    <div className="inline-flex flex-col items-stretch">
      <button
        {...rest}
        disabled={shouldDisable}
        className={`${rest.className || ''} ${shouldDisable ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : ''}`}
      >
        {children}
      </button>
      {shouldDisable && (
        <span className="mt-1 text-xs text-gray-500 text-center">{inactiveHint}</span>
      )}
    </div>
  );
}


