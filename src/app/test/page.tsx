'use client';

import { TestData } from '@/components/TestData';

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <TestData />
      </div>
    </div>
  );
}
