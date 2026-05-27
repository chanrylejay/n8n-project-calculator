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
      <header className="border-b border-surface-border bg-gradient-to-b from-surface/95 to-surface/80 backdrop-blur-lg sticky top-0 z-10 shadow-lg shadow-black/20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8 sm:py-10">
          <div className="flex items-center gap-4 mb-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent-hover shadow-glow">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-zinc-50 tracking-tight">
                n8n Project Calculator
              </h1>
              <p className="text-sm text-zinc-400 mt-1">
                Estimate your automation build cost in 30 seconds.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        {/* Info section */}
        <div className="text-center space-y-3">
          <p className="text-base text-zinc-300 leading-relaxed max-w-2xl mx-auto font-medium">
            Whether you're a business owner exploring automation or a freelancer scoping a client project — get a realistic cost breakdown in seconds.
          </p>
          <p className="text-sm text-zinc-500">No signup required • Instant estimates • Save and share your estimates</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 rounded-lg bg-surface-elevated p-1.5 border border-surface-border shadow-lg shadow-black/20">
          <button
            onClick={() => handleTabChange("quick")}
            className={`flex-1 rounded-md px-4 py-3 text-sm font-bold transition-all duration-200 ${
              activeTab === "quick"
                ? "bg-gradient-to-r from-accent to-accent-hover text-white shadow-lg shadow-accent/40"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Quick Estimate
          </button>
          <button
            data-tab="describe"
            onClick={() => handleTabChange("describe")}
            className={`flex-1 rounded-md px-4 py-3 text-sm font-bold transition-all duration-200 ${
              activeTab === "describe"
                ? "bg-gradient-to-r from-accent to-accent-hover text-white shadow-lg shadow-accent/40"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Describe Your Project
          </button>
        </div>

        {/* Tab content */}
        {activeTab === "quick" ? (
          <div className="space-y-8">
            <div className="rounded-xl border border-surface-border bg-surface-elevated p-6 sm:p-8 shadow-lg shadow-black/10">
              <QuickEstimate formState={formState} onChange={handleFormChange} onShare={handleShare} />
            </div>
            <div ref={resultsRef}>
              <ResultsPanel result={resultSource} />
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="rounded-xl border border-surface-border bg-surface-elevated p-6 sm:p-8 shadow-lg shadow-black/10">
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
      <footer className="border-t border-surface-border/50 mt-16 bg-surface/50 backdrop-blur">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10 sm:py-12">
          <div className="flex flex-col items-center gap-6">
            <div className="text-center space-y-2">
              <p className="text-sm font-semibold text-zinc-300">
                Built by <span className="text-accent font-bold">Chan Cagara</span>
              </p>
              <p className="text-xs text-zinc-500">n8n Workflow Specialist & Automation Engineer</p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="https://chanryle-cagara.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-surface-border bg-surface-elevated text-zinc-400 transition-all hover:border-accent/50 hover:text-accent hover:shadow-glow-sm"
                title="Portfolio"
              >
                <Globe className="h-5 w-5" />
              </a>
              <a
                href="https://www.upwork.com/freelancers/~01c62edc2e375ef8ce"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-surface-border bg-surface-elevated text-zinc-400 transition-all hover:border-accent/50 hover:text-accent hover:shadow-glow-sm"
                title="Upwork"
              >
                <Briefcase className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com/in/chanrylejay"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-surface-border bg-surface-elevated text-zinc-400 transition-all hover:border-accent/50 hover:text-accent hover:shadow-glow-sm"
                title="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://github.com/chanrylejay"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-surface-border bg-surface-elevated text-zinc-400 transition-all hover:border-accent/50 hover:text-accent hover:shadow-glow-sm"
                title="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
            <p className="text-xs text-zinc-600 text-center">
              Need help building your n8n automation? I'm available for freelance projects.
            </p>
          </div>
        </div>
      </footer>

      {/* Toast notification */}
      <div
        className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
          toastVisible ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-3 rounded-lg bg-gradient-to-r from-success to-success-dark border border-success/50 shadow-lg shadow-success/30 px-5 py-3 text-sm font-medium text-white">
          <Check className="h-5 w-5" />
          {toastMessage}
        </div>
      </div>
    </div>
  );
}

export default App;
