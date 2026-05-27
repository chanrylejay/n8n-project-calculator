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
}: {
  label: string;
  value: number | null;
  options: { label: string }[];
  onChange: (idx: number | null) => void;
  note?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">{label}</label>
      <div className="relative">
        <select
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))}
          className="w-full appearance-none rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-4 py-3 pr-10 text-sm text-gray-200 transition-colors hover:border-[#FF6D5A]/40 focus:border-[#FF6D5A] focus:outline-none focus:ring-1 focus:ring-[#FF6D5A]/30"
        >
          <option value="">Select...</option>
          {options.map((opt, i) => (
            <option key={i} value={i}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
      </div>
      {note && <p className="text-xs text-[#FF6D5A]/80 italic">{note}</p>}
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
        className="w-full rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-3 py-2.5 text-sm text-gray-200 placeholder-gray-600 transition-colors hover:border-[#FF6D5A]/40 focus:border-[#FF6D5A] focus:outline-none focus:ring-1 focus:ring-[#FF6D5A]/30"
      />
      <input
        type="number"
        value={custom.cost || ""}
        onChange={(e) => onCustomChange({ ...custom, cost: parseFloat(e.target.value) || 0 })}
        placeholder="0.00"
        min="0"
        step="0.01"
        className="w-full rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-3 py-2.5 text-sm text-gray-200 placeholder-gray-600 transition-colors hover:border-[#FF6D5A]/40 focus:border-[#FF6D5A] focus:outline-none focus:ring-1 focus:ring-[#FF6D5A]/30"
      />
    </div>
  );
}

function CheckboxGroup({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: { label: string; cost?: number }[];
  selected: number[];
  onToggle: (idx: number) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">{label}</label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {options.map((opt, i) => {
          const isSelected = selected.includes(i);
          return (
            <button
              key={i}
              type="button"
              onClick={() => onToggle(i)}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-sm transition-all ${
                isSelected
                  ? "border-[#FF6D5A] bg-[#FF6D5A]/10 text-[#FF6D5A]"
                  : "border-[#2a2a2a] bg-[#1a1a1a] text-gray-400 hover:border-[#FF6D5A]/30"
              }`}
            >
              <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                  isSelected ? "border-[#FF6D5A] bg-[#FF6D5A]" : "border-gray-600"
                }`}
              >
                {isSelected && (
                  <svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              <span>{opt.label}</span>
            </button>
          );
        })}
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
  const showOtherTool = formState.tools.includes(7); // index of "Other tool (custom)"

  const handleReset = useCallback(() => {
    onChange(initialFormState);
  }, [onChange]);

  return (
    <div className="space-y-5">
      <SelectField
        label='1. "What are you automating?"'
        value={formState.automation}
        options={AUTOMATION_OPTIONS}
        onChange={(v) => set("automation", v)}
      />

      <SelectField
        label="2. How many apps are connected?"
        value={formState.apps}
        options={APPS_OPTIONS}
        onChange={(v) => set("apps", v)}
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
      />

      {showAIProvider && (
        <div className="animate-fadeIn space-y-2">
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

      <div className="space-y-2">
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

      <div className="space-y-2">
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

      <div className="space-y-2">
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

      <div className="space-y-2">
        <CheckboxGroup
          label="9. Other tools?"
          options={TOOL_OPTIONS.map((t) => ({ label: t.label + (t.cost > 0 ? ` (+$${t.cost}/mo)` : ""), cost: t.cost }))}
          selected={formState.tools}
          onToggle={(i) => toggleArrayItem("tools", i)}
        />
        {showOtherTool && (
          <CustomFields
            namePlaceholder="e.g. HubSpot, Zapier"
            custom={formState.customTool}
            onCustomChange={(e) => setCustom("customTool", e)}
          />
        )}
      </div>

      <CheckboxGroup
        label="10. Add-ons?"
        options={ADDON_OPTIONS.map((a) => ({ label: `${a.label} (+$${a.buildCost})` }))}
        selected={formState.addons}
        onToggle={(i) => toggleArrayItem("addons", i)}
      />

      <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-4 py-2.5 text-sm text-gray-400 transition-colors hover:border-[#FF6D5A]/30 hover:text-[#FF6D5A]"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
          <button
            type="button"
            onClick={onShare}
            className="inline-flex items-center gap-2 rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-4 py-2.5 text-sm text-gray-400 transition-colors hover:border-[#FF6D5A]/30 hover:text-[#FF6D5A]"
          >
            <Share2 className="h-4 w-4" />
            Share
          </button>
        </div>
        <p className="text-xs text-gray-600">
          Using tools not listed here?{" "}
          <button
            type="button"
            onClick={() => {
              const tab = document.querySelector('[data-tab="describe"]') as HTMLButtonElement | null;
              tab?.click();
              const event = new CustomEvent("switchTab", { detail: "describe" });
              window.dispatchEvent(event);
            }}
            className="text-[#FF6D5A]/60 hover:text-[#FF6D5A] underline underline-offset-2 transition-colors"
          >
            Try the Describe Your Project tab
          </button>
          {" "}— our AI can estimate any combination.
        </p>
      </div>
    </div>
  );
}
