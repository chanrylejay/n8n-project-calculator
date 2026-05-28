export type Tier = 1 | 2 | 3;

export interface AutomationOption {
  label: string;
  tier: Tier;
}

export interface TierInfo {
  buildMin: number;
  buildMax: number;
  deliveryMin: number;
  deliveryMax: number;
  workflowsMin: number;
  workflowsMax: number;
  nodesMin: number;
  nodesMax: number;
}

export const AUTOMATION_OPTIONS: AutomationOption[] = [
  { label: "Email sorting / filtering", tier: 1 },
  { label: "Lead capture to CRM", tier: 1 },
  { label: "Form submission to notification", tier: 1 },
  { label: "Data sync between 2 apps", tier: 2 },
  { label: "AI-powered chatbot", tier: 2 },
  { label: "Social media auto-posting", tier: 2 },
  { label: "Invoice / payment processing", tier: 2 },
  { label: "Error monitoring / alerting", tier: 3 },
  { label: "Multi-step approval workflow", tier: 3 },
  { label: "Custom / complex integration", tier: 3 },
];

export const TIER_INFO: Record<Tier, TierInfo> = {
  1: { buildMin: 15, buildMax: 20, deliveryMin: 1, deliveryMax: 2, workflowsMin: 1, workflowsMax: 1, nodesMin: 5, nodesMax: 15 },
  2: { buildMin: 50, buildMax: 50, deliveryMin: 2, deliveryMax: 4, workflowsMin: 1, workflowsMax: 2, nodesMin: 15, nodesMax: 30 },
  3: { buildMin: 100, buildMax: 250, deliveryMin: 4, deliveryMax: 7, workflowsMin: 2, workflowsMax: 4, nodesMin: 25, nodesMax: 60 },
};

export const APPS_OPTIONS = [
  { label: "1-2 apps", tierBump: 0 },
  { label: "3-4 apps", tierBump: 1 },
  { label: "5+ apps", tierBump: 2 },
];

export const AI_OPTIONS = [
  { label: "No AI needed", aiFlag: "none" as const, tierBump: 0 },
  { label: "Basic AI (classify, summarize)", aiFlag: "low" as const, tierBump: 0 },
  { label: "Advanced AI (generate, analyze, chat)", aiFlag: "medium" as const, tierBump: 1 },
  { label: "Heavy AI (multi-step reasoning, agents)", aiFlag: "high" as const, tierBump: 1 },
];

export type AILevel = "none" | "low" | "medium" | "high";

export const HOSTING_OPTIONS = [
  { label: "Already have n8n set up", cost: 0 },
  { label: "n8n Cloud Starter (2,500 runs/mo)", cost: 24 },
  { label: "n8n Cloud Pro (10,000 runs/mo)", cost: 60 },
  { label: "Self-hosted on Hetzner CX23", cost: 4.5 },
  { label: "Self-hosted on Hetzner CX33", cost: 7 },
  { label: "Self-hosted on DigitalOcean", cost: 12 },
  { label: "Self-hosted on Railway", cost: 10 },
  { label: "Not sure yet", cost: 4.5, note: "We recommend self-hosted Hetzner CX23 as the most affordable option" },
  { label: "Other hosting provider", cost: -1 },
];

export const FREQUENCY_OPTIONS = [
  { label: "A few times a day", executions: 100 },
  { label: "Every hour", executions: 720 },
  { label: "Every 15 minutes", executions: 2880 },
  { label: "Every 5 minutes", executions: 8640 },
  { label: "Webhook / on-demand", executions: -1 },
];

export interface AIProviderOption {
  label: string;
  costs: Record<AILevel, number>;
}

export const AI_PROVIDER_OPTIONS: AIProviderOption[] = [
  { label: "DeepSeek V4 Flash (cheapest)", costs: { none: 0, low: 0.5, medium: 2, high: 5 } },
  { label: "DeepSeek V4 Pro (reasoning)", costs: { none: 0, low: 5, medium: 15, high: 30 } },
  { label: "Gemini Flash Lite", costs: { none: 0, low: 1, medium: 5, high: 12 } },
  { label: "Gemini Flash", costs: { none: 0, low: 2, medium: 10, high: 25 } },
  { label: "Gemini Pro", costs: { none: 0, low: 10, medium: 40, high: 80 } },
  { label: "OpenAI GPT-5.4 mini", costs: { none: 0, low: 5, medium: 20, high: 50 } },
  { label: "OpenAI GPT-5.4", costs: { none: 0, low: 15, medium: 60, high: 120 } },
  { label: "Not sure — recommend cheapest", costs: { none: 0, low: 0.5, medium: 2, high: 5 } },
  { label: "Other AI provider", costs: { none: 0, low: -1, medium: -1, high: -1 } },
];

export const DATABASE_OPTIONS = [
  { label: "None needed", cost: 0 },
  { label: "Neon PostgreSQL (free tier)", cost: 0 },
  { label: "Neon Pro", cost: 19 },
  { label: "Supabase (free tier)", cost: 0 },
  { label: "Supabase Pro", cost: 25 },
  { label: "Already have one", cost: 0 },
  { label: "Other database", cost: -1 },
];

export const NOTIFICATION_OPTIONS = [
  { label: "Email (Gmail/SMTP)", cost: 0 },
  { label: "Telegram bot", cost: 0 },
  { label: "Slack", cost: 0 },
  { label: "SMS (Twilio)", cost: 5 },
  { label: "WhatsApp (Twilio)", cost: 8 },
  { label: "None", cost: 0 },
  { label: "Other channel", cost: -1 },
];

export interface ToolOption {
  label: string;
  cost: number;
  note?: string;
}

export const TOOL_OPTIONS: ToolOption[] = [
  { label: "Google Sheets", cost: 0 },
  { label: "Airtable (free)", cost: 0 },
  { label: "Airtable Pro", cost: 20 },
  { label: "SendGrid (free 100/day)", cost: 0 },
  { label: "SendGrid paid", cost: 20 },
  { label: "Healthchecks.io (free)", cost: 0 },
  { label: "Custom domain", cost: 1, note: "~$12/year" },
  { label: "Other tool (custom)", cost: -1 },
  { label: "None of these", cost: 0 },
];

export interface AddonOption {
  label: string;
  buildCost: number;
}

export const ADDON_OPTIONS: AddonOption[] = [
  { label: "Error handling & monitoring", buildCost: 35 },
  { label: "Documentation & handoff guide", buildCost: 25 },
  { label: "Telegram status alerts", buildCost: 20 },
  { label: "Scheduled maintenance setup", buildCost: 35 },
  { label: "Training / walkthrough session", buildCost: 50 },
];

export interface CustomEntry {
  name: string;
  cost: number;
}

export interface FormState {
  automation: number | null;
  apps: number | null;
  ai: number | null;
  hosting: number | null;
  frequency: number | null;
  aiProvider: number | null;
  database: number | null;
  notification: number | null;
  tools: number[];
  addons: number[];
  customHosting: CustomEntry;
  customAI: CustomEntry;
  customDatabase: CustomEntry;
  customNotification: CustomEntry;
  customTool: CustomEntry;
}

export const emptyCustom = (): CustomEntry => ({ name: "", cost: 0 });

export const initialFormState: FormState = {
  automation: null,
  apps: null,
  ai: null,
  hosting: null,
  frequency: null,
  aiProvider: null,
  database: null,
  notification: null,
  tools: [],
  addons: [],
  customHosting: { name: "", cost: 0 },
  customAI: { name: "", cost: 0 },
  customDatabase: { name: "", cost: 0 },
  customNotification: { name: "", cost: 0 },
  customTool: { name: "", cost: 0 },
};

export interface CalculationResult {
  tier: Tier;
  buildMin: number;
  buildMax: number;
  deliveryMin: number;
  deliveryMax: number;
  hostingCost: number;
  hostingLabel: string;
  hostingNote?: string;
  aiCost: number;
  aiModelName: string;
  databaseCost: number;
  databaseLabel: string;
  notificationCost: number;
  notificationLabel: string;
  toolsCost: number;
  toolsBreakdown: { label: string; cost: number }[];
  totalMonthly: number;
  workflowsMin: number;
  workflowsMax: number;
  nodesMin: number;
  nodesMax: number;
  executionsPerMonth: number | string;
  addOnCost: number;
  addOnBreakdown: { label: string; cost: number }[];
}

function clampTier(t: number): Tier {
  return Math.min(3, Math.max(1, t)) as Tier;
}

export function isOtherOption(cost: number): boolean {
  return cost === -1;
}

export function calculate(state: FormState): CalculationResult | null {
  if (state.automation === null) return null;

  const automation = AUTOMATION_OPTIONS[state.automation];
  let tier = automation.tier;

  if (state.apps !== null) {
    tier = clampTier(tier + APPS_OPTIONS[state.apps].tierBump);
  }

  let aiLevel: AILevel = "none";
  if (state.ai !== null) {
    const aiOpt = AI_OPTIONS[state.ai];
    aiLevel = aiOpt.aiFlag;
    tier = clampTier(tier + aiOpt.tierBump);
  }

  const info = TIER_INFO[tier];

  // Hosting
  let hostingCost = 0;
  let hostingLabel = "Hosting";
  let hostingNote: string | undefined;
  if (state.hosting !== null) {
    const hOpt = HOSTING_OPTIONS[state.hosting];
    if (isOtherOption(hOpt.cost)) {
      hostingCost = state.customHosting.cost || 0;
      hostingLabel = state.customHosting.name || "Other hosting";
    } else {
      hostingCost = hOpt.cost;
      hostingNote = hOpt.note;
    }
  }

  // AI provider cost
  let aiCost = 0;
  let aiModelName = "None";
  if (aiLevel !== "none") {
    const providerIdx = state.aiProvider ?? 7;
    const provider = AI_PROVIDER_OPTIONS[providerIdx];
    if (isOtherOption(provider.costs[aiLevel])) {
      aiCost = state.customAI.cost || 0;
      aiModelName = state.customAI.name || "Other AI provider";
    } else {
      aiCost = provider.costs[aiLevel];
      // If "Not sure — recommend cheapest" is selected, show a friendly model name
      if (provider.label === "Not sure — recommend cheapest") {
        aiModelName = "DeepSeek V4 Flash (recommended)";
      } else {
        aiModelName = provider.label;
      }
    }
  }

  // Database
  let databaseCost = 0;
  let databaseLabel = "Database";
  if (state.database !== null) {
    const dOpt = DATABASE_OPTIONS[state.database];
    if (isOtherOption(dOpt.cost)) {
      databaseCost = state.customDatabase.cost || 0;
      databaseLabel = state.customDatabase.name || "Other database";
    } else {
      databaseCost = dOpt.cost;
    }
  }

  // Notification
  let notificationCost = 0;
  let notificationLabel = "Notifications";
  if (state.notification !== null) {
    const nOpt = NOTIFICATION_OPTIONS[state.notification];
    if (isOtherOption(nOpt.cost)) {
      notificationCost = state.customNotification.cost || 0;
      notificationLabel = state.customNotification.name || "Other channel";
    } else {
      notificationCost = nOpt.cost;
    }
  }

  // Tools
  const toolsBreakdown: { label: string; cost: number }[] = [];
  for (const i of state.tools) {
    const tOpt = TOOL_OPTIONS[i];
    if (isOtherOption(tOpt.cost)) {
      toolsBreakdown.push({
        label: state.customTool.name || "Other tool",
        cost: state.customTool.cost || 0,
      });
    } else {
      toolsBreakdown.push({ label: tOpt.label, cost: tOpt.cost });
    }
  }
  const toolsCost = toolsBreakdown.reduce((sum, t) => sum + t.cost, 0);

  // Addons
  const addOnBreakdown = state.addons.map(i => ({ label: ADDON_OPTIONS[i].label, cost: ADDON_OPTIONS[i].buildCost }));
  const addOnCost = addOnBreakdown.reduce((sum, a) => sum + a.cost, 0);

  // Executions
  let executionsPerMonth: number | string = 0;
  if (state.frequency !== null) {
    const freq = FREQUENCY_OPTIONS[state.frequency];
    executionsPerMonth = freq.executions === -1 ? "Varies" : freq.executions;
  }

  const totalMonthly = hostingCost + aiCost + databaseCost + notificationCost + toolsCost;

  return {
    tier,
    buildMin: info.buildMin + addOnCost,
    buildMax: info.buildMax + addOnCost,
    deliveryMin: info.deliveryMin,
    deliveryMax: info.deliveryMax,
    hostingCost,
    hostingLabel,
    hostingNote,
    aiCost,
    aiModelName,
    databaseCost,
    databaseLabel,
    notificationCost,
    notificationLabel,
    toolsCost,
    toolsBreakdown,
    totalMonthly,
    workflowsMin: info.workflowsMin,
    workflowsMax: info.workflowsMax,
    nodesMin: info.nodesMin,
    nodesMax: info.nodesMax,
    executionsPerMonth,
    addOnCost,
    addOnBreakdown,
  };
}
