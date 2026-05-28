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
    <div className="group relative rounded-lg border border-zinc-800 bg-surface-card p-6 transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:border-zinc-600 hover:shadow-[0_4px_12px_rgba(249,115,22,0.08)]">
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          {number && (
            <span className="font-mono text-sm font-bold text-zinc-400 tracking-widest">{number}.</span>
          )}
          <div className="flex items-center gap-3 flex-1">
            <Icon className="h-5 w-5 text-accent shrink-0" />
            <h3 className="text-[15px] font-mono font-bold text-text-primary uppercase tracking-widest">{title}</h3>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

function CostLine({ label, value, highlight, valueColor }: { label: string; value: string; highlight?: boolean; valueColor?: string }) {
  return (
    <div className={`flex items-center justify-between text-base font-serif ${highlight ? "py-1" : ""}`}>
      <span className={highlight ? "font-semibold text-zinc-200" : "text-text-secondary"}>{label}</span>
      <span className={valueColor || (highlight ? "font-bold text-[#22C55E]" : "text-text-secondary")}>{value}</span>
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
    <div className="text-center space-y-2 pt-1">
      <div className="h-px bg-zinc-800" />
      <p className="text-sm text-zinc-400" style={{ fontSize: "14px" }}>Ready to build it?</p>
      <p className="text-xs text-zinc-500" style={{ fontSize: "13px" }}>Let's discuss your project and get started.</p>
      <div className="flex items-center justify-center gap-2 text-sm">
        <a
          href="https://www.upwork.com/freelancers/~01c62edc2e375ef8ce"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#F97316] hover:underline transition-colors duration-150"
        >
          Hire me on Upwork
        </a>
        <span className="text-zinc-500">·</span>
        <a
          href="https://linkedin.com/in/chanrylejay"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#F97316] hover:underline transition-colors duration-150"
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
        <div className="text-3xl mb-3">🧮</div>
        <p className="text-base text-zinc-500 font-serif">Select options above to see your estimate</p>
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
              <div className="text-sm text-text-muted mb-2 font-mono uppercase tracking-wider">Estimated Cost</div>
              <div className="text-4xl font-bold text-accent tracking-tight font-serif">
                {r.buildMin === r.buildMax
                  ? `${formatMoney(r.buildMin)}`
                  : `${formatMoney(r.buildMin)}–${formatMoney(r.buildMax)}`}
              </div>
              <div className="text-sm text-zinc-500 mt-2 font-serif">flat rate</div>
            </div>
            
            {r.addOnBreakdown.length > 0 && (
              <div className="space-y-2 pt-3 border-t border-[#2d2c2a]">
                <div className="text-xs font-bold text-text-secondary uppercase tracking-widest font-mono">Add-ons Included</div>
                {r.addOnBreakdown.map((a, i) => (
                  <div key={i} className="flex justify-between text-sm font-serif">
                    <span className="text-text-secondary">{a.label}</span>
                    <span className="text-zinc-300 font-semibold">+${a.cost}</span>
                  </div>
                ))}
              </div>
            )}
            
            <div className="space-y-2 pt-3 border-t border-[#2d2c2a]">
              <CostLine label="Delivery timeframe" value={`${r.deliveryMin}–${r.deliveryMax} days`} valueColor="text-zinc-200" />
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
              <CostLine label={r.hostingLabel || "Hosting"} value={`${formatMoney(r.hostingCost)}/mo`} valueColor={r.hostingCost === 0 ? "text-zinc-500" : "text-white"} />
              {r.aiCost > 0 && (
                <CostLine label="AI API" value={`${formatMoney(r.aiCost)}/mo`} valueColor="text-white" />
              )}
              <CostLine label={r.databaseLabel || "Database"} value={`${formatMoney(r.databaseCost)}/mo`} valueColor={r.databaseCost === 0 ? "text-zinc-500" : "text-white"} />
              <CostLine label={r.notificationLabel || "Notifications"} value={`${formatMoney(r.notificationCost)}/mo`} valueColor={r.notificationCost === 0 ? "text-zinc-500" : "text-white"} />
              <CostLine label="Tools & Services" value={`${formatMoney(r.toolsCost)}/mo`} valueColor={r.toolsCost === 0 ? "text-zinc-500" : "text-white"} />
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
              <div className="text-xs text-zinc-400 uppercase font-semibold tracking-widest font-mono">Workflows</div>
              <div className="text-2xl font-bold text-[#38BDF8] font-serif">
                {r.workflowsMin === r.workflowsMax
                  ? r.workflowsMin
                  : `${r.workflowsMin}–${r.workflowsMax}`}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-zinc-400 uppercase font-semibold tracking-widest font-mono">Nodes</div>
              <div className="text-2xl font-bold text-[#38BDF8] font-serif">{r.nodesMin}–{r.nodesMax}</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-zinc-400 uppercase font-semibold tracking-widest font-mono">Executions</div>
              <div className="text-base font-semibold text-[#38BDF8] font-serif">
                {typeof r.executionsPerMonth === "number"
                  ? r.executionsPerMonth.toLocaleString()
                  : r.executionsPerMonth}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-zinc-400 uppercase font-semibold tracking-widest font-mono">AI Model</div>
              <div className="text-sm font-semibold text-[#38BDF8] font-serif">{r.aiModelName !== "None" ? r.aiModelName : "—"}</div>
            </div>
          </div>

          {(() => {
            // Collect actual integration names, filtering out garbage
            const tags: string[] = [];
            
            // From hosting: actual hosting option name (not "Not sure yet" or "Already have n8n")
            if (r.hostingTag && !/^(Not sure|Already have|Select)/i.test(r.hostingTag)) {
              tags.push(r.hostingTag);
            }
            
            // From AI provider: actual provider name (not "Not sure" or "Select")
            if (r.aiTag && !/^(Not sure|Already have|Select)/i.test(r.aiTag)) {
              tags.push(r.aiTag);
            }
            
            // From database: actual database name (not "None needed" or "Already have one")
            if (r.databaseTag && !/^(None|Already have|Select)/i.test(r.databaseTag)) {
              tags.push(r.databaseTag);
            }
            
            // From notification: actual channel name (not "None")
            if (r.notificationTag && !/^(None|Select)/i.test(r.notificationTag)) {
              tags.push(r.notificationTag);
            }
            
            // From tools: names of checked tools only (not "None of these" or "Other tool")
            for (const t of r.toolsBreakdown) {
              if (!/^(None|Other)/i.test(t.label)) {
                tags.push(t.label);
              }
            }
            
            if (tags.length === 0) return null;
            
            return (
              <div className="pt-3 border-t border-[#2d2c2a]">
                <p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-3 font-mono">Key Integrations</p>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, i) => (
                    <span key={i} className="rounded-md bg-zinc-800 border border-zinc-700 px-2.5 py-1 text-xs font-medium text-text-secondary font-serif">{tag}</span>
                  ))}
                </div>
              </div>
            );
          })()}
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
              <div className="text-sm text-text-muted mb-2 font-mono uppercase tracking-wider">Estimated Cost</div>
              <div className="text-4xl font-bold text-accent tracking-tight font-serif">
                {d.build_cost_min === d.build_cost_max
                  ? `${formatMoney(d.build_cost_min)}`
                  : `${formatMoney(d.build_cost_min)}–${formatMoney(d.build_cost_max)}`}
              </div>
              <div className="text-sm text-zinc-500 mt-2 font-serif">flat rate</div>
            </div>
            <div className="space-y-2 pt-3 border-t border-[#2d2c2a]">
              <CostLine label="Delivery timeframe" value={`${d.delivery_days_min}–${d.delivery_days_max} days`} valueColor="text-zinc-200" />
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
                  <span key={i} className="rounded-md bg-zinc-800 border border-zinc-700 px-2.5 py-1 text-xs font-medium text-text-secondary font-serif">
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
              <CostLine label="Hosting" value={`${formatMoney(d.monthly_hosting_cost)}/mo`} valueColor={d.monthly_hosting_cost === 0 ? "text-zinc-500" : "text-zinc-200"} />
              <CostLine label="AI API" value={`${formatMoney(d.monthly_ai_cost)}/mo`} valueColor={d.monthly_ai_cost === 0 ? "text-zinc-500" : "text-zinc-200"} />
              <CostLine label="Database" value={`${formatMoney(d.monthly_db_cost)}/mo`} valueColor={d.monthly_db_cost === 0 ? "text-zinc-500" : "text-zinc-200"} />
              <CostLine label="Tools & Services" value={`${formatMoney(d.monthly_tools_cost)}/mo`} valueColor={d.monthly_tools_cost === 0 ? "text-zinc-500" : "text-zinc-200"} />
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
              <div className="text-xs text-zinc-400 uppercase font-semibold tracking-widest font-mono">Workflows</div>
              <div className="text-2xl font-bold text-[#38BDF8] font-serif">{d.workflows_needed}</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-zinc-400 uppercase font-semibold tracking-widest font-mono">Nodes</div>
              <div className="text-2xl font-bold text-[#38BDF8] font-serif">{d.estimated_nodes_min}–{d.estimated_nodes_max}</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-zinc-400 uppercase font-semibold tracking-widest font-mono">AI Model</div>
              <div className="text-sm font-semibold text-[#38BDF8] font-serif">{d.ai_model_recommended ?? "None"}</div>
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
