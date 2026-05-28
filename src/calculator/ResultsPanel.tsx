import { Hammer, Calendar, Layers, Info, ExternalLink, TrendingUp } from "lucide-react";
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
  number,
  children,
}: {
  icon: React.ElementType;
  title: string;
  number?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="group relative rounded-lg border border-[#2d2c2a] bg-surface-card p-6 transition-all duration-150 hover:border-accent/30 hover:shadow-glow">
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          {number && (
            <span className="font-mono text-xs font-bold text-accent tracking-widest">{number}.</span>
          )}
          <div className="flex items-center gap-3 flex-1">
            <Icon className="h-5 w-5 text-accent shrink-0" />
            <h3 className="text-sm font-mono font-bold text-text-primary uppercase tracking-widest">{title}</h3>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

function CostLine({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`flex items-center justify-between text-sm font-serif ${highlight ? "py-1" : ""}`}>
      <span className={highlight ? "font-semibold text-text-primary" : "text-text-secondary"}>{label}</span>
      <span className={highlight ? "font-bold text-text-primary" : "text-text-secondary"}>{value}</span>
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
    <div className="rounded-lg border border-[#2d2c2a] bg-surface-card p-6 text-center space-y-4">
      <div className="space-y-2">
        <p className="text-sm font-serif font-semibold text-text-primary">Ready to build it?</p>
        <p className="text-xs text-text-muted font-serif">Let's discuss your project and get started.</p>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <a
          href="https://www.upwork.com/freelancers/~01c62edc2e375ef8ce"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary text-sm w-full sm:w-auto"
        >
          <ExternalLink className="h-4 w-4" />
          Hire me on Upwork
        </a>
        <a
          href="https://linkedin.com/in/chanrylejay"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary w-full sm:w-auto"
        >
          Connect on LinkedIn
        </a>
      </div>
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
      <div className="flex flex-col items-center justify-center rounded-lg border border-accent/20 bg-accent/5 py-12 text-center px-6 animate-fadeIn">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
          <Info className="h-6 w-6 text-accent" />
        </div>
        <p className="text-sm text-text-primary max-w-md font-serif">{error}</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-[#2d2c2a] bg-[#1a1a18] py-20 text-center px-6">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-[#2d2c2a]/50">
          <Layers className="h-6 w-6 text-[#3e3d3a]" />
        </div>
        <p className="text-sm font-serif font-medium text-text-secondary">Select options above to see your estimate</p>
        <p className="text-xs text-text-muted mt-2 font-serif">Answer at least the automation type to get started</p>
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
        <Card icon={Hammer} title="Build Cost" number="01">
          <div className="space-y-4">
            <div>
              <div className="text-xs text-text-muted mb-2 font-mono uppercase tracking-wider">Estimated Cost</div>
              <div className="text-4xl font-bold text-accent tracking-tight font-serif">
                {r.buildMin === r.buildMax
                  ? `${formatMoney(r.buildMin)}`
                  : `${formatMoney(r.buildMin)}–${formatMoney(r.buildMax)}`}
              </div>
              <div className="text-xs text-text-muted mt-2 font-serif">flat rate</div>
            </div>
            
            {r.addOnBreakdown.length > 0 && (
              <div className="space-y-2 pt-3 border-t border-[#2d2c2a]">
                <div className="text-xs font-bold text-text-secondary uppercase tracking-widest font-mono">Add-ons Included</div>
                {r.addOnBreakdown.map((a, i) => (
                  <div key={i} className="flex justify-between text-sm font-serif">
                    <span className="text-text-secondary">{a.label}</span>
                    <span className="text-text-primary font-semibold">+${a.cost}</span>
                  </div>
                ))}
              </div>
            )}
            
            <div className="space-y-2 pt-3 border-t border-[#2d2c2a]">
              <CostLine label="Delivery timeframe" value={`${r.deliveryMin}–${r.deliveryMax} days`} />
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary font-serif">Complexity</span>
                <span className="inline-flex items-center rounded-full bg-accent/15 border border-accent/30 px-3 py-1 text-xs font-bold text-accent font-mono tracking-wider">
                  TIER {r.tier}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Card 2: Monthly Running Cost */}
        <Card icon={Calendar} title="Monthly Cost" number="02">
          <div className="space-y-4">
            <div className="space-y-2">
              <CostLine label={r.hostingLabel} value={`${formatMoney(r.hostingCost)}/mo`} />
              {r.aiCost > 0 && <CostLine label={r.aiModelName} value={`${formatMoney(r.aiCost)}/mo`} />}
              {r.databaseCost > 0 && <CostLine label={r.databaseLabel} value={`${formatMoney(r.databaseCost)}/mo`} />}
              {r.notificationCost > 0 && <CostLine label={r.notificationLabel} value={`${formatMoney(r.notificationCost)}/mo`} />}
              {r.toolsBreakdown.map((t, i) => 
                t.cost > 0 && <CostLine key={i} label={t.label} value={`${formatMoney(t.cost)}/mo`} />
              )}
            </div>
            
            {r.hostingNote && (
              <div className="pt-2 border-t border-[#2d2c2a]">
                <p className="text-xs text-accent italic font-serif">{r.hostingNote}</p>
              </div>
            )}
            
            <div className="pt-3 border-t border-[#2d2c2a]">
              <CostLine 
                label="Total Monthly" 
                value={`${formatMoney(r.totalMonthly)}/mo`}
                highlight
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Card 3: Suggested Architecture — full width */}
      <Card icon={Layers} title="Suggested Architecture" number="03">
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <div className="text-xs text-text-muted uppercase font-semibold tracking-widest font-mono">Workflows</div>
              <div className="text-2xl font-bold text-accent font-serif">
                {r.workflowsMin === r.workflowsMax
                  ? r.workflowsMin
                  : `${r.workflowsMin}–${r.workflowsMax}`}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-text-muted uppercase font-semibold tracking-widest font-mono">Nodes</div>
              <div className="text-2xl font-bold text-accent font-serif">{r.nodesMin}–{r.nodesMax}</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-text-muted uppercase font-semibold tracking-widest font-mono">Executions</div>
              <div className="text-base font-semibold text-accent font-serif">
                {typeof r.executionsPerMonth === "number"
                  ? r.executionsPerMonth.toLocaleString()
                  : r.executionsPerMonth}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-text-muted uppercase font-semibold tracking-widest font-mono">AI Model</div>
              <div className="text-sm font-semibold text-accent truncate font-serif">{r.aiModelName !== "None" ? r.aiModelName : "—"}</div>
            </div>
          </div>

          {(r.aiModelName !== "None" || r.databaseLabel || r.notificationLabel || r.toolsBreakdown.length > 0) && (
            <div className="pt-3 border-t border-[#2d2c2a]">
              <p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-3 font-mono">Key Integrations</p>
              <div className="flex flex-wrap gap-2">
                {r.aiModelName !== "None" && (
                  <span className="rounded-md bg-accent/15 border border-accent/30 px-2.5 py-1 text-xs font-medium text-accent font-serif">{r.aiModelName}</span>
                )}
                {r.databaseLabel && r.databaseCost >= 0 && (
                  <span className="rounded-md bg-accent/10 border border-accent/20 px-2.5 py-1 text-xs font-medium text-text-secondary font-serif">{r.databaseLabel}</span>
                )}
                {r.notificationLabel && (
                  <span className="rounded-md bg-accent/10 border border-accent/20 px-2.5 py-1 text-xs font-medium text-text-secondary font-serif">{r.notificationLabel}</span>
                )}
                {r.toolsBreakdown.map((t, i) => (
                  <span key={i} className="rounded-md bg-[#2d2c2a] border border-[#3e3d3a] px-2.5 py-1 text-xs font-medium text-text-secondary font-serif">{t.label}</span>
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
        <Card icon={Hammer} title="Build Cost" number="01">
          <div className="space-y-4">
            <div>
              <div className="text-xs text-text-muted mb-2 font-mono uppercase tracking-wider">Estimated Cost</div>
              <div className="text-4xl font-bold text-accent tracking-tight font-serif">
                {d.build_cost_min === d.build_cost_max
                  ? `${formatMoney(d.build_cost_min)}`
                  : `${formatMoney(d.build_cost_min)}–${formatMoney(d.build_cost_max)}`}
              </div>
              <div className="text-xs text-text-muted mt-2 font-serif">flat rate</div>
            </div>
            <div className="space-y-2 pt-3 border-t border-[#2d2c2a]">
              <CostLine label="Delivery timeframe" value={`${d.delivery_days_min}–${d.delivery_days_max} days`} />
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary font-serif">Complexity</span>
                <span className="inline-flex items-center rounded-full bg-accent/15 border border-accent/30 px-3 py-1 text-xs font-bold text-accent font-mono tracking-wider">
                  TIER {d.complexity_tier}
                </span>
              </div>
            </div>
            {d.key_integrations.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {d.key_integrations.map((app, i) => (
                  <span key={i} className="rounded-md bg-[#2d2c2a] border border-[#3e3d3a] px-2.5 py-1 text-xs font-medium text-text-secondary font-serif">
                    {app}
                  </span>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Card 2: Monthly Running Cost */}
        <Card icon={Calendar} title="Monthly Cost" number="02">
          <div className="space-y-4">
            <div className="space-y-2">
              <CostLine label="Hosting" value={`${formatMoney(d.monthly_hosting_cost)}/mo`} />
              <CostLine label="AI API" value={`${formatMoney(d.monthly_ai_cost)}/mo`} />
              <CostLine label="Database" value={`${formatMoney(d.monthly_db_cost)}/mo`} />
              <CostLine label="Tools & Services" value={`${formatMoney(d.monthly_tools_cost)}/mo`} />
            </div>
            <div className="pt-3 border-t border-[#2d2c2a]">
              <CostLine 
                label="Total Monthly" 
                value={`${formatMoney(d.monthly_total)}/mo`}
                highlight
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Card 3: Suggested Architecture — full width */}
      <Card icon={Layers} title="Suggested Architecture" number="03">
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <div className="text-xs text-text-muted uppercase font-semibold tracking-widest font-mono">Workflows</div>
              <div className="text-2xl font-bold text-accent font-serif">{d.workflows_needed}</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-text-muted uppercase font-semibold tracking-widest font-mono">Nodes</div>
              <div className="text-2xl font-bold text-accent font-serif">{d.estimated_nodes_min}–{d.estimated_nodes_max}</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-text-muted uppercase font-semibold tracking-widest font-mono">AI Model</div>
              <div className="text-sm font-semibold text-accent truncate font-serif">{d.ai_model_recommended ?? "None"}</div>
            </div>
          </div>

          {d.architecture_summary && (
            <div className="pt-3 border-t border-[#2d2c2a]">
              <p className="text-sm text-text-secondary font-serif leading-relaxed">{d.architecture_summary}</p>
            </div>
          )}
        </div>
      </Card>

      {d.notes && (
        <div className="rounded-lg border border-accent/20 bg-accent/5 px-5 py-4">
          <p className="text-sm text-text-secondary italic font-serif leading-relaxed">{d.notes}</p>
        </div>
      )}

      <ResultsCTA />
    </div>
  );
}
