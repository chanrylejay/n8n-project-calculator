import { useState, useCallback, useEffect } from "react";
import { Briefcase, Globe, Linkedin, Github, Share2, Check } from "lucide-react";
import QuickEstimate from "./calculator/QuickEstimate";
import DescribeProject, { AIEstimateResult } from "./calculator/DescribeProject";
import ResultsPanel, { ResultSource } from "./calculator/ResultsPanel";
import { FormState, initialFormState, calculate } from "./calculator/logic";

type Tab = "quick" | "describe";

function App() {
  const [activeTab, setActiveTab] = useState<Tab>("quick");
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [aiResult, setAiResult] = useState<AIEstimateResult | null>(null);
  const [aiError, setAiError] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail === "describe") setActiveTab("describe");
    };
    window.addEventListener("switchTab", handler);
    return () => window.removeEventListener("switchTab", handler);
  }, []);

  const quickResult = calculate(formState);

  const resultSource: ResultSource = activeTab === "quick"
    ? quickResult
    : aiResult ? { source: "ai", data: aiResult } : null;

  const handleFormChange = useCallback((state: FormState) => {
    setFormState(state);
  }, []);

  const handleAIResult = useCallback((result: AIEstimateResult) => {
    setAiResult(result);
    setAiError("");
  }, []);

  const handleAIError = useCallback((msg: string) => {
    setAiError(msg);
  }, []);

  const handleTabChange = useCallback((tab: Tab) => {
    setActiveTab(tab);
    setAiError("");
  }, []);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  }, []);

  const handleShare = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast("Link copied! Share it with your team.");
    } catch {
      showToast("Could not copy link — try manually.");
    }
  }, [showToast]);

  return (
    <div className="min-h-screen bg-surface-primary text-text-primary">
      {/* Header */}
      <header className="border-b border-[#2d2c2a] bg-surface-primary relative overflow-hidden">
        {/* Gradient glow line below header */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-px bg-gradient-to-r from-transparent via-accent to-transparent opacity-60" />
        <div className="mx-auto max-w-4xl px-6 sm:px-8 py-6 sm:py-8">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-accent font-mono font-bold text-accent text-lg logo-pulse">
                n8n
              </div>
              <h1 className="text-3xl sm:text-[36px] font-serif font-bold text-text-primary tracking-tight">
                Project Calculator
              </h1>
            </div>
            <p className="text-sm sm:text-[18px] text-text-secondary font-serif max-w-xl leading-relaxed">
              Estimate your n8n automation build cost in 30 seconds — development fees, hosting, and monthly running costs.
            </p>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-4xl px-6 sm:px-8 py-10 sm:py-12 space-y-7">
        {/* Tabs */}
        <div className="flex gap-2 bg-surface-card p-1.5 rounded-lg border border-[#2d2c2a]">
          <button
            onClick={() => handleTabChange("quick")}
            className={`flex-1 rounded-md px-4 py-3 text-base font-600 font-sans transition-all ${
              activeTab === "quick"
                ? "bg-accent text-[#faf9f5] shadow-glow"
                : "text-text-muted hover:text-text-secondary"
            }`}
          >
            Quick Estimate
          </button>
          <button
            data-tab="describe"
            onClick={() => handleTabChange("describe")}
            className={`flex-1 rounded-md px-4 py-3 text-base font-600 font-sans transition-all ${
              activeTab === "describe"
                ? "bg-accent text-[#faf9f5] shadow-glow"
                : "text-text-muted hover:text-text-secondary"
            }`}
          >
            Describe Your Project
          </button>
        </div>

        {/* Tab content */}
        {activeTab === "quick" ? (
          <div className="space-y-7">
            <div className="rounded-lg border border-[#2d2c2a] bg-surface-card p-8 shadow-lg">
              <QuickEstimate formState={formState} onChange={handleFormChange} onShare={handleShare} />
            </div>
            <div>
              <ResultsPanel result={resultSource} />
            </div>
          </div>
        ) : (
          <div className="space-y-7">
            <div className="rounded-lg border border-[#2d2c2a] bg-surface-card p-8 shadow-lg">
              <DescribeProject
                onResult={handleAIResult}
                onError={handleAIError}
                isLoading={aiLoading}
                setIsLoading={setAiLoading}
              />
            </div>
            {/* Only show results when there's an AI result or error */}
            {(aiResult || aiError) && (
              <div>
                <ResultsPanel result={resultSource} error={aiError || undefined} />
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#2d2c2a] bg-surface-primary/50 backdrop-blur-md mt-14">
        <div className="mx-auto max-w-4xl px-6 sm:px-8 py-12">
          <div className="space-y-6">
            <div className="h-px bg-[#2d2c2a]" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-2">
                <p className="text-sm font-mono font-bold text-accent uppercase tracking-widest">About</p>
                <p className="text-sm text-text-secondary font-serif">
                  Built by <span className="text-accent font-semibold">Chanryle Jay Cagara</span>, an AI Automation Specialist building production n8n workflows and self-hosted infrastructure.
                </p>
              </div>
              <div className="space-y-3">
                <p className="text-sm font-mono font-bold text-accent uppercase tracking-widest">Connect</p>
                <div className="flex items-center gap-4">
                  <a
                    href="https://chanryle-cagara.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-muted hover:text-accent transition-colors duration-150 font-sans text-sm"
                  >
                    Portfolio
                  </a>
                  <a
                    href="https://linkedin.com/in/chanrylejay"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-muted hover:text-accent transition-colors duration-150 font-sans text-sm"
                  >
                    LinkedIn
                  </a>
                  <a
                    href="https://github.com/chanrylejay"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-muted hover:text-accent transition-colors duration-150 font-sans text-sm"
                  >
                    GitHub
                  </a>
                  <a
                    href="https://www.upwork.com/freelancers/~01c62edc2e375ef8ce"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-muted hover:text-accent transition-colors duration-150 font-sans text-sm"
                  >
                    Upwork
                  </a>
                </div>
              </div>
            </div>
            <div className="h-px bg-[#2d2c2a]" />
            <p className="text-sm text-text-muted text-center font-sans">
              Designed & built by Chanryle.{" "}
              <a
                href="https://www.upwork.com/freelancers/~01c62edc2e375ef8ce"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#F97316] hover:underline transition-colors duration-150"
              >
                Open to freelance n8n projects.
              </a>
            </p>
          </div>
        </div>
      </footer>

      {/* Toast notification */}
      <div
        className={`fixed bottom-6 right-6 z-50 transition-all duration-300 font-sans ${
          toastVisible ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-3 rounded-lg bg-accent text-[#faf9f5] border border-accent/40 shadow-glow px-5 py-3 text-sm font-500">
          <Check className="h-5 w-5" />
          {toastMessage}
        </div>
      </div>
    </div>
  );
}

export default App;
