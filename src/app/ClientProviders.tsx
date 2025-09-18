'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import PhoneConsultationWidget from '@/components/common/PhoneConsultationWidget';

interface ClientProvidersProps {
  children: ReactNode;
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <AuthProvider>
      {children}
      <PhoneConsultationWidget />
    </AuthProvider>
  );
}


