import { useState, useCallback, useEffect, useRef } from "react";
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
  const resultsRef = useRef<HTMLDivElement>(null);

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
    setTimeout(() => setToastVisible(false), 2500);
  }, []);

  const handleShare = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast("Link copied! Share it with your team.");
    } catch {
      showToast("Could not copy link — try manually.");
    }
  }, [showToast]);

  const handleAIScroll = useCallback(() => {
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }, []);

  return (
    <div className="min-h-screen bg-surface text-zinc-50">
      {/* Header */}
      <header className="border-b border-surface-border bg-surface/80 backdrop-blur-md sticky top-0 z-10">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-[28px] font-bold text-zinc-50 tracking-tight">
              n8n Project Calculator
            </h1>
          </div>
          <p className="text-base text-zinc-400 ml-[52px]">
            Estimate your n8n automation build cost in 30 seconds.
          </p>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Info section */}
        <p className="text-sm text-zinc-400 text-center leading-relaxed max-w-xl mx-auto">
          Whether you're a business owner exploring automation or a freelancer scoping a client project — get a realistic cost breakdown in seconds. No signup required.
        </p>

        {/* Tabs */}
        <div className="flex gap-1 rounded-lg bg-surface-card p-1 border border-surface-border">
          <button
            onClick={() => handleTabChange("quick")}
            className={`flex-1 rounded-md px-4 py-2.5 text-sm font-medium transition-all ${
              activeTab === "quick"
                ? "bg-accent text-white shadow-lg shadow-accent/20"
                : "text-zinc-400 hover:text-zinc-300"
            }`}
          >
            Quick Estimate
          </button>
          <button
            data-tab="describe"
            onClick={() => handleTabChange("describe")}
            className={`flex-1 rounded-md px-4 py-2.5 text-sm font-medium transition-all ${
              activeTab === "describe"
                ? "bg-accent text-white shadow-lg shadow-accent/20"
                : "text-zinc-400 hover:text-zinc-300"
            }`}
          >
            Describe Your Project
          </button>
        </div>

        {/* Tab content */}
        {activeTab === "quick" ? (
          <div className="space-y-8">
            <div className="rounded-xl border border-surface-border bg-surface-card p-5 sm:p-6">
              <QuickEstimate formState={formState} onChange={handleFormChange} onShare={handleShare} />
            </div>
            <div ref={resultsRef}>
              <ResultsPanel result={resultSource} />
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="rounded-xl border border-surface-border bg-surface-card p-5 sm:p-6">
              <DescribeProject
                onResult={handleAIResult}
                onError={handleAIError}
                isLoading={aiLoading}
                setIsLoading={setAiLoading}
                onScrollToResults={handleAIScroll}
              />
            </div>
            <div ref={resultsRef}>
              <ResultsPanel result={resultSource} error={aiError || undefined} />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-surface-border mt-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8 sm:py-10">
          <div className="flex flex-col items-center gap-4">
            <p className="text-sm text-zinc-400">
              Built by <span className="text-zinc-200 font-medium">Chan Cagara</span> — n8n Workflow Specialist
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://chanryle-cagara.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-surface-border bg-surface-card text-zinc-400 transition-all hover:border-accent/30 hover:text-accent"
                title="Portfolio"
              >
                <Globe className="h-4 w-4" />
              </a>
              <a
                href="https://www.upwork.com/freelancers/~01c62edc2e375ef8ce"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-surface-border bg-surface-card text-zinc-400 transition-all hover:border-accent/30 hover:text-accent"
                title="Upwork"
              >
                <Briefcase className="h-4 w-4" />
              </a>
              <a
                href="https://linkedin.com/in/chanrylejay"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-surface-border bg-surface-card text-zinc-400 transition-all hover:border-accent/30 hover:text-accent"
                title="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="https://github.com/chanrylejay"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-surface-border bg-surface-card text-zinc-400 transition-all hover:border-accent/30 hover:text-accent"
                title="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
            </div>
            <p className="text-xs text-zinc-500 text-center">
              Need help building this? I'm available for n8n projects.
            </p>
          </div>
        </div>
      </footer>

      {/* Toast notification */}
      <div
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
          toastVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-2 rounded-lg bg-surface-card border border-surface-border shadow-xl shadow-black/40 px-4 py-3 text-sm text-zinc-200">
          <Check className="h-4 w-4 text-green-500" />
          {toastMessage}
        </div>
      </div>
    </div>
  );
}

export default App;
