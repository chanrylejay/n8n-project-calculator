import { useState, useCallback } from "react";
import { Sparkles } from "lucide-react";

export interface AIEstimateResult {
  complexity_tier: number;
  build_cost_min: number;
  build_cost_max: number;
  delivery_days_min: number;
  delivery_days_max: number;
  workflows_needed: number;
  estimated_nodes_min: number;
  estimated_nodes_max: number;
  needs_ai: boolean;
  ai_model_recommended: string | null;
  monthly_hosting_cost: number;
  monthly_ai_cost: number;
  monthly_db_cost: number;
  monthly_tools_cost: number;
  monthly_total: number;
  key_integrations: string[];
  architecture_summary: string;
  notes: string;
}

interface DescribeProjectProps {
  onResult: (result: AIEstimateResult) => void;
  onError: (message: string) => void;
  isLoading: boolean;
  setIsLoading: (v: boolean) => void;
  onScrollToResults: () => void;
}

const RATE_LIMIT_KEY = "n8n_calc_rate";
const MAX_PER_DAY = 3;

function getTodayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function getUsageCount(): { count: number; date: string } {
  try {
    const raw = localStorage.getItem(RATE_LIMIT_KEY);
    if (!raw) return { count: 0, date: getTodayKey() };
    const data = JSON.parse(raw);
    if (data.date !== getTodayKey()) {
      return { count: 0, date: getTodayKey() };
    }
    return { count: data.count ?? 0, date: data.date };
  } catch {
    return { count: 0, date: getTodayKey() };
  }
}

function incrementUsage(): number {
  const { count, date } = getUsageCount();
  const next = count + 1;
  localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify({ count: next, date }));
  return next;
}

export default function DescribeProject({ onResult, onError, isLoading, setIsLoading, onScrollToResults }: DescribeProjectProps) {
  const [text, setText] = useState("");
  const [rateLimited, setRateLimited] = useState(false);

  const remaining = MAX_PER_DAY - getUsageCount().count;

  const handleSubmit = useCallback(async () => {
    if (!text.trim()) {
      onError("Please describe your project first.");
      return;
    }

    const usage = getUsageCount();
    if (usage.count >= MAX_PER_DAY) {
      setRateLimited(true);
      onError("You've used your 3 free estimates today. Try the Quick Estimate tab for unlimited instant estimates, or come back tomorrow!");
      return;
    }

    setIsLoading(true);
    onError("");

    try {
      const res = await fetch("/api/estimate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description: text.trim() }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        const msg = errData?.error || `API returned ${res.status}`;
        throw new Error(msg);
      }

      const raw = await res.json();
      const parsed: AIEstimateResult = typeof raw === "string" ? JSON.parse(raw) : raw;

      if (!parsed.complexity_tier || !parsed.build_cost_min) {
        throw new Error("Invalid response structure");
      }

      incrementUsage();
      onResult(parsed);
      onScrollToResults();
    } catch {
      onError("Something went wrong. Try the Quick Estimate tab for instant results, or try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [text, onResult, onError, setIsLoading, onScrollToResults]);

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-zinc-50">Describe Your Project</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isLoading}
          rows={6}
          placeholder="Example: I want to automatically capture leads from my website form, save them to a Google Sheet, and send me a Telegram notification when a new lead comes in."
          className="form-input resize-none min-h-[140px] disabled:opacity-60 disabled:cursor-not-allowed"
        />
        <div className="flex items-center justify-between">
          <p className="text-xs text-zinc-500">
            Powered by AI — <span className="text-accent font-semibold">{Math.max(0, remaining)}</span> free estimate{remaining !== 1 ? "s" : ""} remaining today
          </p>
          {remaining === 0 && (
            <p className="text-xs text-warning font-medium">Limit reached — try Quick Estimate or come back tomorrow</p>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isLoading || rateLimited || !text.trim()}
        className="btn-primary w-full"
      >
        {isLoading ? (
          <>
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span>Analyzing your project...</span>
          </>
        ) : (
          <>
            <Sparkles className="h-5 w-5" />
            <span>Get AI Estimate</span>
          </>
        )}
      </button>
    </div>
  );
}
