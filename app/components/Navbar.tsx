"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";

interface NavItem {
  label: string;
  href: string;
  hasDropdown?: boolean;
}

function ChevronDown() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

export default function Navbar() {
  const { t, language, setLanguage } = useLanguage();

  const navItems: NavItem[] = [
    { label: t.navbar.buyCrypto, href: "#", hasDropdown: true },
    { label: t.navbar.markets, href: "#" },
    { label: t.navbar.trade, href: "#", hasDropdown: true },
    { label: t.navbar.earn, href: "#", hasDropdown: true },
    { label: t.navbar.support, href: "#", hasDropdown: true },
  ];

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'es' : 'en');
  };

  return (
    <nav className="flex items-center justify-between px-6 h-16 bg-[#181A21]">
      {/* Left section - Logo and Nav Items */}
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center">
          <Image
            src="/images/binance.svg"
            alt="Binance"
            width={120}
            height={24}
            priority
          />
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-1 px-4 py-2 text-sm text-[#EAECEF] hover:text-[#FCD535] transition-colors font-semibold"
            >
              {item.label}
              {item.hasDropdown && <ChevronDown />}
            </Link>
          ))}
        </div>
      </div>

      {/* Right section - Auth and Settings */}
      <div className="flex items-center gap-3">
        <Link
          href="#"
          className="px-4 py-2 text-sm text-[#EAECEF] hover:text-[#FCD535] transition-colors font-semibold"
        >
          {t.navbar.logIn}
        </Link>
        <Link
          href="#"
          className="px-4 py-2 text-sm bg-[#FCD535] text-[#181A21] rounded hover:bg-[#e5c030] transition-colors font-semibold"
        >
          {t.navbar.signUp}
        </Link>
        
        {/* Language Switcher */}
        <button 
          onClick={toggleLanguage}
          className="p-2 text-[#EAECEF] hover:text-[#FCD535] transition-colors flex items-center gap-1"
          title={`Switch to ${language === 'en' ? 'Spanish' : 'English'}`}
        >
          <GlobeIcon />
          <span className="text-sm font-medium uppercase">{language}</span>
        </button>

        <button className="p-2 text-[#EAECEF] hover:text-[#FCD535] transition-colors">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15.23 20.403a9.011 9.011 0 005.684-7.153h-3.942c-.147 2.86-.793 5.388-1.741 7.153zm-.757-7.153c-.178 4.102-1.217 7.25-2.473 7.25-1.256 0-2.295-3.148-2.473-7.25h4.946zm0-2.5H9.527C9.705 6.648 10.744 3.5 12 3.5c1.256 0 2.295 3.148 2.473 7.25zm2.499 0h3.942a9.01 9.01 0 00-5.683-7.153c.948 1.765 1.594 4.293 1.741 7.153zm-9.936 0c.147-2.862.793-5.392 1.743-7.156a9.01 9.01 0 00-5.693 7.156h3.95zm0 2.5h-3.95a9.01 9.01 0 005.693 7.157c-.95-1.765-1.596-4.295-1.743-7.157z"
            />
          </svg>
        </button>
      </div>
    </nav>
  );
}
