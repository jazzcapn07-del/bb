"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  disabled?: boolean;
  children?: { id: string; label: string; disabled?: boolean }[];
}

interface FAQSidebarProps {
  activeItem?: string;
  onItemClick?: (id: string) => void;
}

const menuItems: MenuItem[] = [
  {
    id: "account-functions",
    label: "Account Functions",
    icon: "/images/icons/account.png",
    disabled: true,
    children: [
      { id: "account-settings", label: "Account Settings", disabled: true },
      { id: "identity-verification", label: "Identity Verification", disabled: true },
    ],
  },
  {
    id: "tutorial",
    label: "Tutorial",
    icon: "/images/icons/functions.png",
    disabled: true,
  },
  {
    id: "crypto-deposit",
    label: "Crypto Deposit/Withdrawal",
    icon: "/images/icons/withdrawals.png",
    disabled: true,
    children: [
      { id: "deposit-crypto", label: "Deposit Crypto", disabled: true },
      { id: "withdraw-crypto", label: "Withdraw Crypto", disabled: true },
    ],
  },
  {
    id: "buy-crypto",
    label: "Buy Crypto (Fiat/P2P)",
    icon: "/images/icons/fiat.png",
    disabled: true,
    children: [
      { id: "buy-with-card", label: "Buy with Card", disabled: true },
      { id: "p2p-trading", label: "P2P Trading", disabled: true },
    ],
  },
  {
    id: "spot-margin",
    label: "Spot & Margin Trading",
    icon: "/images/icons/spot.png",
    disabled: true,
    children: [
      { id: "spot-trading", label: "Spot Trading", disabled: true },
      { id: "margin-trading", label: "Margin Trading", disabled: true },
    ],
  },
  {
    id: "trading-bots",
    label: "Trading Bots",
    icon: "/images/icons/bots.png",
    disabled: true,
    children: [
      { id: "grid-trading", label: "Grid Trading", disabled: true },
      { id: "dca-bot", label: "DCA Bot", disabled: true },
    ],
  },
  {
    id: "finance",
    label: "Finance",
    icon: "/images/icons/finance.png",
    disabled: true,
    children: [
      { id: "earn", label: "Binance Earn", disabled: true },
      { id: "loans", label: "Crypto Loans", disabled: true },
    ],
  },
  {
    id: "fan-token",
    label: "Binance Fan Token",
    icon: "/images/icons/fan_token.png",
    disabled: true,
  },
  {
    id: "api",
    label: "API",
    icon: "/images/icons/api.png",
    disabled: false,
    children: [
      { id: "api-tutorial", label: "API Tutorial", disabled: false },
      { id: "api-management", label: "API Management", disabled: true },
    ],
  },
  {
    id: "nft",
    label: "NFT",
    icon: "/images/icons/nft.png",
    disabled: true,
    children: [
      { id: "nft-marketplace", label: "NFT Marketplace", disabled: true },
      { id: "nft-mint", label: "Mint NFT", disabled: true },
    ],
  },
  {
    id: "vip",
    label: "VIP",
    icon: "/images/icons/vip.png",
    disabled: true,
  },
  {
    id: "security",
    label: "Security",
    icon: "/images/icons/security.png",
    disabled: true,
    children: [
      { id: "2fa", label: "Two-Factor Authentication", disabled: true },
      { id: "security-settings", label: "Security Settings", disabled: true },
    ],
  },
  {
    id: "other-topics",
    label: "Other Topics",
    icon: "/images/icons/other.png",
    disabled: true,
    children: [
      { id: "announcements", label: "Announcements", disabled: true },
      { id: "general-faq", label: "General FAQ", disabled: true },
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.2 },
  },
};

export default function FAQSidebar({ activeItem, onItemClick }: FAQSidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>(["api"]);
  const [hoveredDisabled, setHoveredDisabled] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleItemClick = (item: MenuItem) => {
    if (item.disabled) return;
    if (item.children) {
      toggleExpand(item.id);
    } else {
      onItemClick?.(item.id);
    }
  };

  const handleChildClick = (childId: string, disabled?: boolean) => {
    if (disabled) return;
    onItemClick?.(childId);
  };

  return (
    <nav className="w-[260px] flex-shrink-0">
      <div className="sticky top-0 pt-4 pb-8 overflow-y-auto max-h-screen">
        <motion.ul
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-0"
        >
          {menuItems.map((item) => (
            <motion.li key={item.id} variants={itemVariants}>
              <div className="relative">
                <button
                  onClick={() => handleItemClick(item)}
                  onMouseEnter={() => item.disabled && setHoveredDisabled(item.id)}
                  onMouseLeave={() => setHoveredDisabled(null)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 text-sm transition-colors cursor-pointer ${
                    item.disabled
                      ? "text-gray-500 cursor-not-allowed"
                      : activeItem === item.id || expandedItems.includes(item.id)
                      ? "text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Image
                      src={item.icon}
                      alt={item.label}
                      width={20}
                      height={20}
                      className={item.disabled ? "opacity-50" : "opacity-80"}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.children && (
                    <motion.svg
                      animate={{ rotate: expandedItems.includes(item.id) ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-gray-500"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </motion.svg>
                  )}
                </button>

                {/* Disabled Tooltip */}
                <AnimatePresence>
                  {hoveredDisabled === item.id && (
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
              </div>

              {/* Submenu */}
              <AnimatePresence>
                {item.children && expandedItems.includes(item.id) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    {/* Yellow divider line */}
                    <div className="ml-3 mr-3 relative">
                      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#FCD535]" />
                      <ul className="pl-6">
                        {item.children.map((child) => (
                          <li key={child.id} className="relative">
                            <button
                              onClick={() => handleChildClick(child.id, child.disabled)}
                              onMouseEnter={() => child.disabled && setHoveredDisabled(child.id)}
                              onMouseLeave={() => setHoveredDisabled(null)}
                              className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                                child.disabled
                                  ? "text-gray-500 cursor-not-allowed"
                                  : activeItem === child.id
                                  ? "text-white bg-[#2B3139] rounded"
                                  : "text-gray-400 hover:text-white cursor-pointer"
                              }`}
                            >
                              {child.label}
                            </button>

                            {/* Child Disabled Tooltip */}
                            <AnimatePresence>
                              {hoveredDisabled === child.id && (
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
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </nav>
  );
}
