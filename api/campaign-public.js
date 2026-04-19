import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { campaignId } = req.body;
  if (!campaignId) return res.status(400).json({ error: 'campaignId is required' });

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  const { data, error } = await supabase
    .from('campaigns')
    .select('id, business_name, google_review_link, active')
    .eq('id', campaignId)
    .eq('active', true)
    .single();

  if (error || !data) return res.status(404).json({ error: 'Campaign not found or inactive' });

  res.json(data);
}
