export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { description } = req.body;

  if (!description || description.trim() === '') {
    return res.status(400).json({ error: 'Please describe your project first.' });
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  const systemPrompt = `You are an n8n automation cost estimator. The user will describe a project they want automated using n8n. Analyze their description and return ONLY a valid JSON object with these exact fields:

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

  try {
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-v4-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: description }
        ],
        temperature: 0.3
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({ error: 'AI service error' });
    }

    const content = data.choices[0].message.content;
    const parsed = JSON.parse(content);
    return res.status(200).json(parsed);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to get estimate' });
  }
}
