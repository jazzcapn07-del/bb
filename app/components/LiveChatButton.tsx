"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toggleChatwoot } from "./ChatwootWidget";

export default function LiveChatButton() {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    toggleChatwoot();
  };

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.3, type: "spring", stiffness: 200 }}
      whileTap={{ scale: 0.95 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 h-14 bg-[#FCD535] rounded-full flex items-center shadow-lg hover:bg-[#e5c030] transition-colors cursor-pointer overflow-hidden"
      aria-label="Open live chat"
    >
      <motion.div
        className="flex items-center"
        animate={{
          paddingLeft: isHovered ? 20 : 16,
          paddingRight: isHovered ? 20 : 16,
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        {/* Headphones icon */}
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#181A21"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="flex-shrink-0"
        >
          <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
          <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
        </svg>

        {/* Support text */}
        <motion.span
          className="text-[#181A21] font-semibold whitespace-nowrap overflow-hidden"
          animate={{
            width: isHovered ? "auto" : 0,
            marginLeft: isHovered ? 8 : 0,
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          Support
        </motion.span>
      </motion.div>
    </motion.button>
  );
}
