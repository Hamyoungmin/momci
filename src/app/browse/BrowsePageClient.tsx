'use client';

import BrowseBoard from '@/components/browse/BrowseBoard';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscriptionStatus } from '@/hooks/useSubscriptionStatus';

export default function BrowsePageClient() {
  const { currentUser, userData } = useAuth();
  const sub = useSubscriptionStatus(currentUser?.uid);
  const isAllowed = !!currentUser && userData?.userType === 'parent' && sub.hasActiveSubscription && sub.subscriptionType === 'parent';
  if (!isAllowed) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center text-gray-700">
        <p className="mb-3 font-semibold">이용권이 없을 때는 이용권을 구매후 사용해주세요.</p>
        <a href="/parent-payment" className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl">이용권 구매하러 가기</a>
      </div>
    );
  }
  return <BrowseBoard />;
}


