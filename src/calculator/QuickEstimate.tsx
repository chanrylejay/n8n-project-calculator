import { useCallback } from "react";
import { ChevronDown, RotateCcw, Share2 } from "lucide-react";
import {
  FormState,
  initialFormState,
  AUTOMATION_OPTIONS,
  APPS_OPTIONS,
  AI_OPTIONS,
  HOSTING_OPTIONS,
  FREQUENCY_OPTIONS,
  AI_PROVIDER_OPTIONS,
  DATABASE_OPTIONS,
  NOTIFICATION_OPTIONS,
  TOOL_OPTIONS,
  ADDON_OPTIONS,
  isOtherOption,
  CustomEntry,
} from "./logic";

interface QuickEstimateProps {
  formState: FormState;
  onChange: (state: FormState) => void;
  onShare: () => void;
}

function SelectField({
  label,
  value,
  options,
  onChange,
  note,
  section,
}: {
  label: string;
  value: number | null;
  options: { label: string }[];
  onChange: (idx: number | null) => void;
  note?: string;
  section?: "primary" | "secondary";
}) {
  return (
    <div className="space-y-2.5">
      <label className={`block text-sm font-semibold ${
        section === "primary" ? "text-zinc-50" : "text-zinc-300"
      }`}>
        {label}
      </label>
      <div className="relative">
        <select
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))}
          className={`form-input ${value !== null ? "border-accent/40 bg-accent/5" : ""}`}
        >
          <option value="">Select...</option>
          {options.map((opt, i) => (
            <option key={i} value={i}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
      </div>
      {note && <p className="text-xs text-info italic">{note}</p>}
    </div>
  );
}

function CustomFields({
  namePlaceholder,
  custom,
  onCustomChange,
}: {
  namePlaceholder: string;
  custom: CustomEntry;
  onCustomChange: (entry: CustomEntry) => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-slideDown">
      <input
        type="text"
        value={custom.name}
        onChange={(e) => onCustomChange({ ...custom, name: e.target.value })}
        placeholder={namePlaceholder}
        className="form-input"
      />
      <input
        type="number"
        value={custom.cost || ""}
        onChange={(e) => onCustomChange({ ...custom, cost: parseFloat(e.target.value) || 0 })}
        placeholder="0.00"
        min="0"
        step="0.01"
        className="form-input"
      />
    </div>
  );
}

function CheckboxGroup({
  label,
  options,
  selected,
  onToggle,
  costSuffix,
}: {
  label: string;
  options: { label: string; cost?: number }[];
  selected: number[];
  onToggle: (idx: number) => void;
  costSuffix?: boolean;
}) {
  return (
    <div className="space-y-2.5">
      <label className="block text-sm font-semibold text-zinc-300">{label}</label>
      <div className="rounded-lg border border-surface-border bg-surface-elevated divide-y divide-surface-border overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2">
          {options.map((opt, i) => {
            const isSelected = selected.includes(i);
            const col = i % 2 === 0 ? "sm:border-r" : "";
            return (
              <button
                key={i}
                type="button"
                onClick={() => onToggle(i)}
                className={`flex items-center gap-2.5 px-4 py-3 text-left text-sm transition-all duration-200 ${col} ${
                  isSelected
                    ? "bg-accent/15 text-accent font-medium"
                    : "text-zinc-400 hover:bg-zinc-700/30 hover:text-zinc-300"
                }`}
              >
                <span
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-md border-2 transition-all duration-200 ${
                    isSelected ? "border-accent bg-accent" : "border-zinc-600"
                  }`}
                >
                  {isSelected && (
                    <svg className="h-2.5 w-2.5 text-white" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                <span className="flex-1">{opt.label}</span>
                {costSuffix && opt.cost !== undefined && opt.cost > 0 && (
                  <span className="text-zinc-500 text-xs font-normal">+${opt.cost}/mo</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function QuickEstimate({ formState, onChange, onShare }: QuickEstimateProps) {
  const set = useCallback(
    (key: keyof FormState, value: unknown) => {
      onChange({ ...formState, [key]: value });
    },
    [formState, onChange]
  );

  const setCustom = useCallback(
    (key: keyof FormState, entry: CustomEntry) => {
      onChange({ ...formState, [key]: entry });
    },
    [formState, onChange]
  );

  const toggleArrayItem = useCallback(
    (key: "tools" | "addons", idx: number) => {
      const arr = formState[key] as number[];
      const next = arr.includes(idx) ? arr.filter((x) => x !== idx) : [...arr, idx];
      set(key, next);
    },
    [formState, set]
  );

  const showAIProvider = formState.ai !== null && formState.ai !== 0;

  const hostingNote =
    formState.hosting !== null ? HOSTING_OPTIONS[formState.hosting].note : undefined;

  const showOtherHosting = formState.hosting !== null && isOtherOption(HOSTING_OPTIONS[formState.hosting].cost);
  const showOtherAI = formState.aiProvider !== null && isOtherOption(AI_PROVIDER_OPTIONS[formState.aiProvider].costs.low);
  const showOtherDatabase = formState.database !== null && isOtherOption(DATABASE_OPTIONS[formState.database].cost);
  const showOtherNotification = formState.notification !== null && isOtherOption(NOTIFICATION_OPTIONS[formState.notification].cost);
  const showOtherTool = formState.tools.includes(7);

  const handleReset = useCallback(() => {
    onChange(initialFormState);
  }, [onChange]);

  return (
    <div className="space-y-8">
      {/* Primary Section */}
      <div className="space-y-6 pb-4 border-b border-surface-border/30">
        <div className="space-y-1 mb-4">
          <h3 className="text-base font-bold text-zinc-50 tracking-tight">Your Automation</h3>
          <p className="text-xs text-zinc-500">Tell us what you're building</p>
        </div>
        
        <SelectField
          label='1. What are you automating?'
          value={formState.automation}
          options={AUTOMATION_OPTIONS}
          onChange={(v) => set("automation", v)}
          section="primary"
        />

        <SelectField
          label="2. How many apps are connected?"
          value={formState.apps}
          options={APPS_OPTIONS}
          onChange={(v) => set("apps", v)}
          section="primary"
        />

        <SelectField
          label="3. Does it need AI?"
          value={formState.ai}
          options={AI_OPTIONS}
          onChange={(v) => {
            set("ai", v);
            if (v === null || v === 0) {
              set("aiProvider", null);
            }
          }}
          section="primary"
        />
      </div>

      {/* Secondary Section */}
      <div className="space-y-6">
        <div className="space-y-1 mb-4">
          <h3 className="text-sm font-semibold text-zinc-300 tracking-tight">Infrastructure & Features</h3>
          <p className="text-xs text-zinc-500">Where it runs and what it needs</p>
        </div>

        <div className="space-y-2.5">
          <SelectField
            label="4. Where will n8n run?"
            value={formState.hosting}
            options={HOSTING_OPTIONS}
            onChange={(v) => set("hosting", v)}
            note={hostingNote}
          />
          {showOtherHosting && (
            <CustomFields
              namePlaceholder="e.g. AWS EC2, Vultr"
              custom={formState.customHosting}
              onCustomChange={(e) => setCustom("customHosting", e)}
            />
          )}
        </div>

        <SelectField
          label="5. How often will it run?"
          value={formState.frequency}
          options={FREQUENCY_OPTIONS}
          onChange={(v) => set("frequency", v)}
        />

        {showAIProvider && (
          <div className="animate-fadeIn space-y-2.5">
            <SelectField
              label="6. Which AI provider?"
              value={formState.aiProvider}
              options={AI_PROVIDER_OPTIONS}
              onChange={(v) => set("aiProvider", v)}
            />
            {showOtherAI && (
              <CustomFields
                namePlaceholder="e.g. Claude, Mistral"
                custom={formState.customAI}
                onCustomChange={(e) => setCustom("customAI", e)}
              />
            )}
          </div>
        )}

        <div className="space-y-2.5">
          <SelectField
            label="7. Database needed?"
            value={formState.database}
            options={DATABASE_OPTIONS}
            onChange={(v) => set("database", v)}
          />
          {showOtherDatabase && (
            <CustomFields
              namePlaceholder="e.g. PlanetScale, CockroachDB"
              custom={formState.customDatabase}
              onCustomChange={(e) => setCustom("customDatabase", e)}
            />
          )}
        </div>

        <div className="space-y-2.5">
          <SelectField
            label="8. Notification channel?"
            value={formState.notification}
            options={NOTIFICATION_OPTIONS}
            onChange={(v) => set("notification", v)}
          />
          {showOtherNotification && (
            <CustomFields
              namePlaceholder="e.g. PagerDuty, Discord"
              custom={formState.customNotification}
              onCustomChange={(e) => setCustom("customNotification", e)}
            />
          )}
        </div>

        <CheckboxGroup
          label="9. Other tools?"
          options={TOOL_OPTIONS.map((t) => ({ label: t.label, cost: t.cost > 0 ? t.cost : undefined }))}
          selected={formState.tools}
          onToggle={(i) => toggleArrayItem("tools", i)}
          costSuffix
        />
        {showOtherTool && (
          <CustomFields
            namePlaceholder="e.g. HubSpot, Zapier"
            custom={formState.customTool}
            onCustomChange={(e) => setCustom("customTool", e)}
          />
        )}

        <CheckboxGroup
          label="10. Add-ons?"
          options={ADDON_OPTIONS.map((a) => ({ label: a.label, cost: a.buildCost }))}
          selected={formState.addons}
          onToggle={(i) => toggleArrayItem("addons", i)}
          costSuffix
        />
      </div>

      {/* Action Buttons */}
      <div className="pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-surface-border/30">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="btn-secondary"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
          <button
            type="button"
            onClick={onShare}
            className="btn-secondary"
          >
            <Share2 className="h-4 w-4" />
            Share
          </button>
        </div>
        <p className="text-xs text-zinc-500">
          Using tools not listed here?{" "}
          <button
            type="button"
            onClick={() => {
              const tab = document.querySelector('[data-tab="describe"]') as HTMLButtonElement | null;
              tab?.click();
              const event = new CustomEvent("switchTab", { detail: "describe" });
              window.dispatchEvent(event);
            }}
            className="text-accent/80 hover:text-accent font-medium transition-colors underline underline-offset-2"
          >
            Try the Describe Your Project tab
          </button>
          {" — "}our AI can estimate any combination.
        </p>
      </div>
    </div>
  );
}
