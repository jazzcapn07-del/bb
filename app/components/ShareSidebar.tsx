"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface RelatedArticle {
  id: string;
  title: string;
  href: string;
  disabled?: boolean;
}

interface ShareSidebarProps {
  relatedArticles?: RelatedArticle[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: 10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.2 },
  },
};

export default function ShareSidebar({ relatedArticles = [] }: ShareSidebarProps) {
  const [hoveredDisabled, setHoveredDisabled] = useState<string | null>(null);

  const shareLinks = [
    {
      name: "X",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      onClick: () => {
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}`, "_blank");
      },
    },
    {
      name: "Facebook",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
      onClick: () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, "_blank");
      },
    },
    {
      name: "Telegram",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
        </svg>
      ),
      onClick: () => {
        window.open(`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}`, "_blank");
      },
    },
    {
      name: "Reddit",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
        </svg>
      ),
      onClick: () => {
        window.open(`https://www.reddit.com/submit?url=${encodeURIComponent(window.location.href)}`, "_blank");
      },
    },
    {
      name: "VK",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4.03 8.57 4.03 8.096c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.677.863 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.27-1.422 2.18-3.61 2.18-3.61.119-.254.322-.491.763-.491h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.05.17.49-.085.744-.576.744z" />
        </svg>
      ),
      onClick: () => {
        window.open(`https://vk.com/share.php?url=${encodeURIComponent(window.location.href)}`, "_blank");
      },
    },
    {
      name: "Weibo",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M10.098 20.323c-3.977.391-7.414-1.406-7.672-4.02-.259-2.609 2.759-5.047 6.74-5.441 3.979-.394 7.413 1.404 7.671 4.018.259 2.6-2.759 5.049-6.737 5.439l-.002.004zM9.05 17.219c-.384.616-1.208.884-1.829.602-.612-.279-.793-.991-.406-1.593.379-.595 1.176-.861 1.793-.601.622.263.82.972.442 1.592zm1.27-1.627c-.141.237-.449.353-.689.253-.236-.09-.313-.361-.177-.586.138-.227.436-.346.672-.24.239.09.315.36.18.573h.014zm.176-2.719c-1.893-.493-4.033.45-4.857 2.118-.836 1.704-.026 3.591 1.886 4.21 1.983.64 4.318-.341 5.132-2.179.8-1.793-.201-3.642-2.161-4.149zm7.563-1.224c-.346-.105-.579-.18-.405-.649.381-.999.42-1.867.003-2.481-.784-1.144-2.924-1.081-5.328-.03 0 0-.763.334-.568-.271.37-1.2.314-2.2-.262-2.779-1.307-1.303-4.78.046-7.753 3.018C1.461 10.769 0 13.268 0 15.388c0 4.053 5.191 6.519 10.273 6.519 6.656 0 11.088-3.868 11.088-6.94.003-1.857-1.57-2.912-3.302-3.318zm1.143-6.146c-.637-.727-1.576-1.063-2.619-.986l-.165.018c-.214.024-.378.212-.378.427 0 .237.193.43.43.43l.141-.011c.705-.052 1.341.175 1.773.666.432.49.608 1.148.493 1.853-.035.214.112.413.326.449.025.004.049.007.074.007.186 0 .348-.131.384-.32.156-.958-.084-1.853-.671-2.533h.212z" />
        </svg>
      ),
      onClick: () => {
        window.open(`https://service.weibo.com/share/share.php?url=${encodeURIComponent(window.location.href)}`, "_blank");
      },
    },
  ];

  return (
    <aside className="w-[240px] flex-shrink-0">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="sticky top-0 pt-4 pb-8"
      >
        {/* Share Post Section */}
        <motion.div variants={itemVariants} className="mb-8">
          <h3 className="text-sm font-semibold text-white mb-4">Share Post</h3>
          <div className="flex items-center gap-3">
            {shareLinks.map((link) => (
              <button
                key={link.name}
                onClick={link.onClick}
                className="text-gray-500 hover:text-white transition-colors cursor-pointer"
                title={`Share on ${link.name}`}
              >
                {link.icon}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Related Articles Section */}
        {relatedArticles.length > 0 && (
          <motion.div variants={itemVariants}>
            <h3 className="text-sm font-semibold text-white mb-4">Related Articles</h3>
            <ul className="space-y-1">
              {relatedArticles.map((article) => (
                <li key={article.id} className="relative">
                  <button
                    onClick={(e) => {
                      if (article.disabled) {
                        e.preventDefault();
                        return;
                      }
                      window.location.href = article.href;
                    }}
                    onMouseEnter={() => article.disabled && setHoveredDisabled(article.id)}
                    onMouseLeave={() => setHoveredDisabled(null)}
                    className={`block w-full text-left py-2 px-3 text-sm rounded transition-colors ${
                      article.disabled
                        ? "text-gray-500 cursor-not-allowed"
                        : "text-gray-400 hover:text-white hover:bg-[#2B3139] cursor-pointer"
                    }`}
                  >
                    {article.title}
                  </button>

                  {/* Disabled Tooltip */}
                  <AnimatePresence>
                    {hoveredDisabled === article.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-1/2 -translate-x-1/2 top-full mt-1 z-50 px-3 py-1.5 bg-[#2B3139] text-gray-300 text-xs rounded-md whitespace-nowrap shadow-lg"
                      >
                        Unavailable during account assistance
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#2B3139] rotate-45" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </motion.div>
    </aside>
  );
}
