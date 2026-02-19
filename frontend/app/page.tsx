'use client';

import React from 'react';
import { ChatSection } from '@/components/ChatSection';
import { DocumentList } from '@/components/DocumentList';

// --- Main Page Component ---
const Page = () => {
  return (
    <div className="h-[calc(100vh-10rem)] w-full bg-background overflow-hidden flex flex-col md:flex-row">
      {/* Chat Section - Left Side - Fixed Width (e.g., 400px or 30%) on Desktop */}
      <div className="w-full md:w-[450px] shrink-0 h-[50vh] md:h-full border-b md:border-b-0 md:border-r border-border/40 z-10 shadow-xl shadow-black/5 bg-background">
        <ChatSection />
      </div>

      {/* Document List - Right Side - Flexible Width */}
      <div className="flex-1 h-[50vh] md:h-full min-w-0 bg-muted/20">
        <DocumentList />
      </div>
    </div>
  );
};

export default Page;