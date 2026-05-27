import { Hammer, Calendar, Layers, Info, ExternalLink } from "lucide-react";
import { CalculationResult } from "./logic";
import { AIEstimateResult } from "./DescribeProject";

export interface AIResultAdapter {
  source: "ai";
  data: AIEstimateResult;
}

export type ResultSource = CalculationResult | AIResultAdapter | null;

function isAIResult(result: ResultSource): result is AIResultAdapter {
  return result !== null && "source" in result && result.source === "ai";
}

function Card({
  icon: Icon,
  title,
  children,
  accent,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-surface-border bg-surface-card p-5 transition-all duration-300 hover:border-accent/20">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.02] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative space-y-3">
        <div className="flex items-center gap-2.5">
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${accent ? "bg-accent/15 text-accent" : "bg-zinc-800 text-zinc-400"}`}>
            <Icon className="h-4 w-4" />
          </div>
          <h3 className="text-base font-semibold text-zinc-400 uppercase tracking-[0.05em]">{title}</h3>
        </div>
        {children}
      </div>
    </div>
  );
}

function CostLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-zinc-500">{label}</span>
      <span className="text-zinc-300">{value}</span>
    </div>
  );
}

function formatMoney(n: number): string {
  if (n === 0) return "$0";
  if (Number.isInteger(n)) return `$${n}`;
  return `$${n.toFixed(2)}`;
}

function ResultsCTA() {
  return (
    <div className="pt-6 text-center space-y-2">
      <div className="h-px bg-surface-border" />
      <p className="text-sm text-zinc-400 pt-3">Need help building this?</p>
      <p className="text-sm">
        <a
          href="https://www.upwork.com/freelancers/~01c62edc2e375ef8ce"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:underline"
        >
          Hire me on Upwork
        </a>
        <span className="text-zinc-600 mx-2">&middot;</span>
        <a
          href="https://linkedin.com/in/chanrylejay"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:underline"
        >
          Connect on LinkedIn
        </a>
        <span className="text-zinc-600 mx-2">&middot;</span>
        <a
          href="https://chanryle-cagara.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:underline"
        >
          See my portfolio
        </a>
      </p>
    </div>
  );
}

interface ResultsPanelProps {
  result: ResultSource;
  error?: string;
}

export default function ResultsPanel({ result, error }: ResultsPanelProps) {
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-accent/20 bg-surface-card py-10 text-center px-4 animate-fadeIn">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
          <Info className="h-5 w-5 text-accent" />
        </div>
        <p className="text-sm text-zinc-400 max-w-md">{error}</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-surface-border bg-surface-card py-16 text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-surface-card">
          <Layers className="h-5 w-5 text-zinc-600" />
        </div>
        <p className="text-sm text-zinc-500">Select options above to see your estimate</p>
      </div>
    );
  }

  if (isAIResult(result)) {
    return <AIResultsPanel data={result.data} />;
  }

  const r = result;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Build Cost */}
        <Card icon={Hammer} title="Build Cost" accent>
          <div className="space-y-3">
            <div className="text-[32px] font-bold text-zinc-50 tracking-tight">
              {r.buildMin === r.buildMax
                ? `${formatMoney(r.buildMin)}`
                : `${formatMoney(r.buildMin)} — ${formatMoney(r.buildMax)}`}
              <span className="ml-1 text-sm font-normal text-zinc-500">flat rate</span>
            </div>
            {r.addOnBreakdown.length > 0 && (
              <div className="space-y-1 text-xs text-zinc-500">
                <div className="text-zinc-400 font-medium text-[11px] uppercase tracking-wider mb-1">Add-ons included</div>
                {r.addOnBreakdown.map((a, i) => (
                  <div key={i} className="flex justify-between">
                    <span>{a.label}</span>
                    <span>+${a.cost}</span>
                  </div>
                ))}
              </div>
            )}
            <div className="h-px bg-surface-border" />
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-500">Estimated delivery</span>
              <span className="text-zinc-300">
                {r.deliveryMin === r.deliveryMax
                  ? `${r.deliveryMin} day${r.deliveryMin !== 1 ? "s" : ""}`
                  : `${r.deliveryMin}–${r.deliveryMax} days`}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-500">Complexity</span>
              <span className="inline-flex items-center rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-semibold text-accent">
                Tier {r.tier}
              </span>
            </div>
          </div>
        </Card>

        {/* Card 2: Monthly Running Cost */}
        <Card icon={Calendar} title="Monthly Running Cost" accent>
          <div className="space-y-3">
            <div className="space-y-2">
              <CostLine label={r.hostingLabel} value={`${formatMoney(r.hostingCost)}/mo`} />
              <CostLine label={r.aiModelName} value={`${formatMoney(r.aiCost)}/mo`} />
              <CostLine label={r.databaseLabel} value={`${formatMoney(r.databaseCost)}/mo`} />
              <CostLine label={r.notificationLabel} value={`${formatMoney(r.notificationCost)}/mo`} />
              {r.toolsBreakdown.map((t, i) => (
                <CostLine key={i} label={t.label} value={`${formatMoney(t.cost)}/mo`} />
              ))}
            </div>
            {r.hostingNote && (
              <p className="text-xs text-accent/70 italic">{r.hostingNote}</p>
            )}
            <div className="h-px bg-surface-border" />
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-zinc-300">Total</span>
              <span className="text-[32px] font-bold text-green-500">
                {formatMoney(r.totalMonthly)}
                <span className="text-sm font-normal text-zinc-500">/mo</span>
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Card 3: Suggested Architecture — full width */}
      <Card icon={Layers} title="Suggested Architecture">
        <div className="space-y-2">
          <CostLine
            label="Workflows needed"
            value={
              r.workflowsMin === r.workflowsMax
                ? `${r.workflowsMin}`
                : `${r.workflowsMin}–${r.workflowsMax}`
            }
          />
          <CostLine
            label="Estimated nodes"
            value={`${r.nodesMin}–${r.nodesMax}`}
          />
          <CostLine
            label="AI model"
            value={r.aiModelName === "None" ? "None" : r.aiModelName}
          />
          <CostLine
            label="Executions/month"
            value={
              typeof r.executionsPerMonth === "number"
                ? r.executionsPerMonth.toLocaleString()
                : r.executionsPerMonth
            }
          />
          {(r.aiModelName !== "None" || r.databaseLabel || r.notificationLabel || r.toolsBreakdown.length > 0) && (
            <div className="pt-1">
              <p className="text-[11px] text-zinc-500 uppercase tracking-wider mb-1.5">Key integrations</p>
              <div className="flex flex-wrap gap-1.5">
                {r.aiModelName !== "None" && (
                  <span className="rounded-md bg-zinc-800/60 border border-surface-border px-2 py-0.5 text-[11px] text-zinc-400">{r.aiModelName}</span>
                )}
                {r.databaseLabel && r.databaseCost >= 0 && (
                  <span className="rounded-md bg-zinc-800/60 border border-surface-border px-2 py-0.5 text-[11px] text-zinc-400">{r.databaseLabel}</span>
                )}
                {r.notificationLabel && (
                  <span className="rounded-md bg-zinc-800/60 border border-surface-border px-2 py-0.5 text-[11px] text-zinc-400">{r.notificationLabel}</span>
                )}
                {r.toolsBreakdown.map((t, i) => (
                  <span key={i} className="rounded-md bg-zinc-800/60 border border-surface-border px-2 py-0.5 text-[11px] text-zinc-400">{t.label}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      <ResultsCTA />
    </div>
  );
}

function AIResultsPanel({ data }: { data: AIEstimateResult }) {
  const d = data;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Build Cost */}
        <Card icon={Hammer} title="Build Cost" accent>
          <div className="space-y-3">
            <div className="text-[32px] font-bold text-zinc-50 tracking-tight">
              {d.build_cost_min === d.build_cost_max
                ? `${formatMoney(d.build_cost_min)}`
                : `${formatMoney(d.build_cost_min)} — ${formatMoney(d.build_cost_max)}`}
              <span className="ml-1 text-sm font-normal text-zinc-500">flat rate</span>
            </div>
            <div className="h-px bg-surface-border" />
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-500">Estimated delivery</span>
              <span className="text-zinc-300">
                {d.delivery_days_min === d.delivery_days_max
                  ? `${d.delivery_days_min} day${d.delivery_days_min !== 1 ? "s" : ""}`
                  : `${d.delivery_days_min}–${d.delivery_days_max} days`}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-500">Complexity</span>
              <span className="inline-flex items-center rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-semibold text-accent">
                Tier {d.complexity_tier}
              </span>
            </div>
            {d.key_integrations.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {d.key_integrations.map((app, i) => (
                  <span key={i} className="rounded-md bg-zinc-800/60 border border-surface-border px-2 py-0.5 text-[11px] text-zinc-400">
                    {app}
                  </span>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Card 2: Monthly Running Cost */}
        <Card icon={Calendar} title="Monthly Running Cost" accent>
          <div className="space-y-3">
            <div className="space-y-2">
              <CostLine label="Hosting" value={`${formatMoney(d.monthly_hosting_cost)}/mo`} />
              <CostLine label="AI API" value={`${formatMoney(d.monthly_ai_cost)}/mo`} />
              <CostLine label="Database" value={`${formatMoney(d.monthly_db_cost)}/mo`} />
              <CostLine label="Tools & Services" value={`${formatMoney(d.monthly_tools_cost)}/mo`} />
            </div>
            <div className="h-px bg-surface-border" />
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-zinc-300">Total</span>
              <span className="text-[32px] font-bold text-green-500">
                {formatMoney(d.monthly_total)}
                <span className="text-sm font-normal text-zinc-500">/mo</span>
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Card 3: Suggested Architecture — full width */}
      <Card icon={Layers} title="Suggested Architecture">
        <div className="space-y-2">
          <CostLine label="Workflows needed" value={`${d.workflows_needed}`} />
          <CostLine label="Estimated nodes" value={`${d.estimated_nodes_min}–${d.estimated_nodes_max}`} />
          <CostLine label="AI model" value={d.ai_model_recommended ?? "None"} />
          {d.architecture_summary && (
            <div className="pt-1">
              <p className="text-xs text-zinc-500 leading-relaxed">{d.architecture_summary}</p>
            </div>
          )}
        </div>
      </Card>

      {d.notes && (
        <div className="rounded-lg border border-surface-border bg-surface-card px-4 py-3">
          <p className="text-xs text-zinc-500 italic leading-relaxed">{d.notes}</p>
        </div>
      )}

      <ResultsCTA />
    </div>
  );
}
