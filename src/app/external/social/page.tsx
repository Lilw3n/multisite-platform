'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SocialRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirection automatique vers /external/social/communities
    router.replace('/external/social/communities');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirection vers les communautés...</p>
      </div>
    </div>
  );
}