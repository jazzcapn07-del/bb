"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import CountryCodeModal, { Country } from "./components/CountryCodeModal";
import { useLanguage } from "./context/LanguageContext";

export default function Home() {
  const router = useRouter();
  const { t } = useLanguage();
  const [inputValue, setInputValue] = useState("");
  const [isPhoneMode, setIsPhoneMode] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [isCountryModalOpen, setIsCountryModalOpen] = useState(false);
  const [showDisabledTooltip, setShowDisabledTooltip] = useState<string | null>(null);
  const [inputFocused, setInputFocused] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Validation logic - checks if current input is invalid
  const checkValidation = (value: string) => {
    if (!value.trim()) {
      return { isValid: true, message: "" };
    }

    const trimmedValue = value.trim();

    // Check if it looks like a phone number (starts with digit or +)
    const looksLikePhone = /^\+?\d/.test(trimmedValue) || isPhoneMode;

    if (looksLikePhone) {
      // Phone validation - only digits allowed
      const phoneDigits = trimmedValue.replace(/^\+/, "");
      if (/[^0-9]/.test(phoneDigits)) {
        return {
          isValid: false,
          message: t.home.validationError,
        };
      }
      return { isValid: true, message: "" };
    } else {
      // Email validation - check for spaces or invalid characters
      if (/\s/.test(trimmedValue)) {
        return {
          isValid: false,
          message: t.home.validationError,
        };
      }
      return { isValid: true, message: "" };
    }
  };

  // Detect if input looks like a phone number
  useEffect(() => {
    const value = inputValue.trim();
    const isPhone = /^\+?\d/.test(value) || /^\d{3,}$/.test(value.replace(/\s/g, ""));

    if (isPhone && !isPhoneMode) {
      setIsPhoneMode(true);
      if (!selectedCountry) {
        setSelectedCountry({
          name: "United Kingdom",
          code: "GB",
          dialCode: "+44",
          flag: "🇬🇧",
        });
      }
    } else if (!isPhone && value.includes("@")) {
      setIsPhoneMode(false);
    }
  }, [inputValue, isPhoneMode, selectedCountry]);

  // Refocus input when switching to phone mode
  useEffect(() => {
    if (isPhoneMode && inputRef.current) {
      // Small delay to ensure the new input is rendered
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }, [isPhoneMode]);

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
  };

  const handleSocialButtonClick = (provider: string) => {
    setShowDisabledTooltip(provider);
    setTimeout(() => setShowDisabledTooltip(null), 3000);
  };

  const handleClearInput = () => {
    setInputValue("");
    setIsPhoneMode(false);
    setShowError(false);
    setErrorMessage("");
  };

  const handleSubmit = async () => {
    // Validate input before submitting
    if (!inputValue.trim()) {
      setShowError(true);
      setErrorMessage(t.home.emptyError);
      return;
    }

    // Check validation
    const validation = checkValidation(inputValue);
    if (!validation.isValid) {
      setShowError(true);
      setErrorMessage(validation.message);
      return;
    }

    setIsSubmitting(true);
    setShowError(false);
    setErrorMessage("");

    try {
      const payload = isPhoneMode && selectedCountry
        ? {
            phone: inputValue,
            country: selectedCountry,
            isPhone: true,
          }
        : {
            email: inputValue,
            isPhone: false,
          };

      const response = await fetch('/api/submit-contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit contact information');
      }
      const email = inputValue.trim();
      localStorage.setItem('email', email);
      if (email) {
        // Redirect to assistance page on success
        router.push('/questions?email=' + email);
      }
    } catch (error: any) {
      console.error("Error submitting contact:", error);
      setShowError(true);
      setErrorMessage(error.message || "Failed to submit. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    // Clear error when user starts typing again
    if (showError) {
      setShowError(false);
      setErrorMessage("");
    }

    // Check validation on each keystroke
    const validation = checkValidation(newValue);
    if (!validation.isValid) {
      setShowError(true);
      setErrorMessage(validation.message);
    }
  };

  // Animation variants - faster and subtler
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
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.2 },
    },
  };

  const isError = showError;

  return (
    <div className="min-h-screen bg-[#181A21] flex flex-col">
      <Navbar />

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md"
        >
          {/* Title */}
          <motion.h1
            variants={itemVariants}
            className="text-2xl sm:text-3xl font-semibold text-white mb-8"
          >
            {t.home.title}
          </motion.h1>

          {/* Email/Phone Input */}
          <motion.div variants={itemVariants} className="mb-2">
            <label className="block text-sm text-gray-400 mb-2">
              {t.home.emailPhoneLabel}
            </label>

            {isPhoneMode && selectedCountry ? (
              // Phone mode - split input with gap
              <div className="flex flex-col md:flex-row gap-2 flex-wrap">
                {/* Country Code Button */}
                <button
                  type="button"
                  onClick={() => setIsCountryModalOpen(true)}
                  className={`flex items-center gap-2 flex-shrink-0 px-4 py-3 bg-[#2B3139] rounded-lg border transition-all duration-200 cursor-pointer ${
                    isError
                      ? "border-red-500"
                      : inputFocused
                      ? "border-[#FCD535]"
                      : "border-gray-600 hover:border-gray-500"
                  }`}
                >
                  <span className="text-xl">{selectedCountry.flag}</span>
                  <span className="text-white text-sm whitespace-nowrap">
                    {selectedCountry.dialCode.replace("+", "+ ")}
                  </span>
                </button>

                {/* Phone Number Input */}
                <div className="relative flex-1">
                  <input
                    ref={inputRef}
                    type="tel"
                    value={inputValue}
                    onChange={handleInputChange}
                    onFocus={() => setInputFocused(true)}
                    onBlur={() => setInputFocused(false)}
                    className={`w-full h-full py-3 pl-4 pr-16 bg-[#2B3139] text-white rounded-lg border transition-all duration-200 focus:outline-none ${
                      isError
                        ? "border-red-500"
                        : inputFocused
                        ? "border-[#FCD535]"
                        : "border-gray-600 hover:border-gray-500"
                    }`}
                    placeholder={t.home.phonePlaceholder}
                  />
                  {/* Dropdown indicator and clear button */}
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsCountryModalOpen(true)}
                      className="text-gray-400 hover:text-gray-300 transition-colors p-1 cursor-pointer"
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </button>
                    {inputValue && (
                      <button
                        type="button"
                        onClick={handleClearInput}
                        className="text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              // Email mode - single input
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  className={`w-full py-3 px-4 bg-[#2B3139] text-white rounded-lg border transition-all duration-200 focus:outline-none ${
                    isError
                      ? "border-red-500"
                      : inputFocused
                      ? "border-[#FCD535]"
                      : "border-gray-600 hover:border-gray-500"
                  }`}
                  placeholder={t.home.emailPhonePlaceholder}
                />
                {inputValue && (
                  <button
                    type="button"
                    onClick={handleClearInput}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" />
                    </svg>
                  </button>
                )}
              </div>
            )}
          </motion.div>

          {/* Validation Error Message */}
          <AnimatePresence>
            {isError && errorMessage && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-red-500 text-sm mb-4 mt-2"
              >
                {errorMessage}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Spacer when no error */}
          {!isError && <div className="mb-4" />}

          {/* Next Button */}
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.005 }}
            whileTap={{ scale: 0.995 }}
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`w-full py-3.5 bg-[#FCD535] text-[#181A21] font-semibold rounded-lg hover:bg-[#e5c030] transition-colors mb-8 cursor-pointer ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <motion.div
                  className="w-5 h-5 border-2 border-[#181A21]/30 border-t-[#181A21] rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                />
                {t.common.loading}
              </span>
            ) : (
              t.common.next
            )}
          </motion.button>

          {/* Divider */}
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-4 mb-6"
          >
            <div className="flex-1 h-px bg-gray-700" />
            <span className="text-gray-500 text-sm cursor-default">{t.common.or}</span>
            <div className="flex-1 h-px bg-gray-700" />
          </motion.div>

          {/* SSO Notice */}
          <motion.p
            variants={itemVariants}
            className="text-center text-gray-500 text-xs mb-4 cursor-default"
          >
            {t.home.ssoNotice}
          </motion.p>

          {/* Social Login Buttons */}
          <motion.div variants={itemVariants} className="space-y-3 mb-8">
            {/* Google Button */}
            <div className="relative">
              <button
                onClick={() => handleSocialButtonClick("google")}
                className="w-full py-3.5 px-4 bg-[#2B3139] text-gray-500 rounded-lg flex items-center justify-center gap-3 cursor-not-allowed opacity-50"
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                {t.home.googleButton}
              </button>
              <AnimatePresence>
                {showDisabledTooltip === "google" && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-4 py-2 bg-[#FCD535] text-[#181A21] text-sm rounded-lg shadow-lg whitespace-nowrap z-10"
                  >
                    {t.home.disabledTooltip}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Apple Button */}
            <div className="relative">
              <button
                onClick={() => handleSocialButtonClick("apple")}
                className="w-full py-3.5 px-4 bg-[#2B3139] text-gray-500 rounded-lg flex items-center justify-center gap-3 cursor-not-allowed opacity-50"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                {t.home.appleButton}
              </button>
              <AnimatePresence>
                {showDisabledTooltip === "apple" && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-4 py-2 bg-[#FCD535] text-[#181A21] text-sm rounded-lg shadow-lg whitespace-nowrap z-10"
                  >
                    {t.home.disabledTooltip}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Create Account Link */}
          <motion.div variants={itemVariants}>
            <Link
              href="#"
              className="text-[#FCD535] hover:underline text-sm transition-colors"
            >
              {t.home.createAccount}
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="py-4 text-center text-gray-500 text-sm"
      >
        <span>{t.common.copyright}</span>
        <span className="mx-4">·</span>
        <Link href="#" className="hover:text-gray-300 transition-colors">
          {t.common.cookiePreferences}
        </Link>
      </motion.footer>

      {/* Country Code Modal */}
      <CountryCodeModal
        isOpen={isCountryModalOpen}
        onClose={() => setIsCountryModalOpen(false)}
        onSelect={handleCountrySelect}
        selectedCountry={selectedCountry}
      />
    </div>
  );
}
