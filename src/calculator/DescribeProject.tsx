import { useState, useCallback } from "react";
import { Sparkles, AlertCircle } from "lucide-react";

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

const SYSTEM_PROMPT = `You are an n8n automation cost estimator. The user will describe a project they want automated using n8n. Analyze their description and return ONLY a valid JSON object with these exact fields:

{
  "complexity_tier": 1 or 2 or 3,
  "build_cost_min": number,
  "build_cost_max": number,
  "delivery_days_min": number,
  "delivery_days_max": number,
  "workflows_needed": number,
  "estimated_nodes_min": number,
  "estimated_nodes_max": number,
  "needs_ai": true or false,
  "ai_model_recommended": "string or null",
  "monthly_hosting_cost": number,
  "monthly_ai_cost": number,
  "monthly_db_cost": number,
  "monthly_tools_cost": number,
  "monthly_total": number,
  "key_integrations": ["list of app/service names"],
  "architecture_summary": "1-2 sentence description of the suggested setup",
  "notes": "any important caveats or assumptions"
}

Pricing rules:
- Tier 1 (simple, 1-2 apps, no AI): build cost $15-20, delivery 1-2 days, 1 workflow, 5-15 nodes
- Tier 2 (medium, 3-4 apps or basic AI): build cost $50, delivery 2-4 days, 1-2 workflows, 15-30 nodes
- Tier 3 (complex, 5+ apps or advanced AI or multi-step): build cost $100-250, delivery 4-7 days, 2-4 workflows, 25-60 nodes

For hosting, recommend self-hosted Hetzner CX23 at $4.50/mo as default unless the project clearly needs more resources.
For AI, default to DeepSeek V4 Flash at $0.50-2/mo for light use unless the task requires reasoning.
For database, default to Neon PostgreSQL free tier at $0/mo unless the project needs more storage.

Return ONLY the JSON object. No markdown, no explanation, no code fences.`;

export default function DescribeProject({ onResult, onError, isLoading, setIsLoading }: DescribeProjectProps) {
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
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const res = await fetch(`${supabaseUrl}/functions/v1/estimate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({ description: text.trim(), systemPrompt: SYSTEM_PROMPT }),
      });

      if (!res.ok) {
        throw new Error(`API returned ${res.status}`);
      }

      const raw = await res.json();
      const parsed: AIEstimateResult = typeof raw === "string" ? JSON.parse(raw) : raw;

      if (!parsed.complexity_tier || !parsed.build_cost_min) {
        throw new Error("Invalid response structure");
      }

      incrementUsage();
      onResult(parsed);
    } catch {
      onError("Something went wrong. Try the Quick Estimate tab for instant results, or try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [text, onResult, onError, setIsLoading]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isLoading}
          rows={5}
          placeholder="Example: I want to automatically capture leads from my website form, save them to a Google Sheet, and send me a Telegram notification when a new lead comes in."
          className="w-full resize-none rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-4 py-3 text-sm text-gray-200 placeholder-gray-600 transition-colors hover:border-[#FF6D5A]/40 focus:border-[#FF6D5A] focus:outline-none focus:ring-1 focus:ring-[#FF6D5A]/30 disabled:opacity-50"
        />
        <p className="text-xs text-gray-600">
          Powered by AI — {Math.max(0, remaining)} free estimate{remaining !== 1 ? "s" : ""} remaining today
        </p>
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isLoading || rateLimited}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#FF6D5A] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#ff5a45] hover:shadow-lg hover:shadow-[#FF6D5A]/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
      >
        {isLoading ? (
          <>
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Analyzing your project...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            Get My Estimate
          </>
        )}
      </button>
    </div>
  );
}
