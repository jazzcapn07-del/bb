"use client";

import FAQSidebar from "./FAQSidebar";
import ShareSidebar from "./ShareSidebar";

interface RelatedArticle {
  id: string;
  title: string;
  href: string;
  disabled?: boolean;
}

interface FAQLayoutProps {
  children: React.ReactNode;
  activeMenuItem?: string;
  onMenuItemClick?: (id: string) => void;
  relatedArticles?: RelatedArticle[];
}

export default function FAQLayout({
  children,
  activeMenuItem,
  onMenuItemClick,
  relatedArticles = [],
}: FAQLayoutProps) {
  return (
    <div className="flex">
      {/* Left Sidebar - Sticky, starts near page edge - Hidden on mobile */}
      <div className="hidden lg:block pl-4 pr-0">
        <FAQSidebar activeItem={activeMenuItem} onItemClick={onMenuItemClick} />
      </div>

      {/* Grey vertical divider - Hidden on mobile */}
      <div className="hidden lg:block w-px bg-gray-700/50 flex-shrink-0" />

      {/* Main Content - Scrollable */}
      <main className="flex-1 min-w-0 px-4 sm:px-6 md:px-8 py-4">
        {children}
      </main>

      {/* Right Sidebar - Sticky - Hidden on mobile */}
      <div className="hidden xl:block pr-6">
        <ShareSidebar relatedArticles={relatedArticles} />
      </div>
    </div>
  );
}
