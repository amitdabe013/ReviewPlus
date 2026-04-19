import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { campaignId, rating, generatedReview } = req.body;
  if (!campaignId || !rating) return res.status(400).json({ error: 'campaignId and rating are required' });

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  const { data: campaign, error } = await supabase
    .from('campaigns')
    .select('id, google_review_link, active, total_reviews, total_rating, positive_redirects, negative_feedbacks')
    .eq('id', campaignId)
    .eq('active', true)
    .single();

  if (error || !campaign) return res.status(404).json({ error: 'Campaign not found or inactive' });

  const redirectedToGoogle = rating >= 4;

  await Promise.all([
    supabase.from('reviews').insert({
      campaign_id: campaignId,
      rating,
      generated_review: generatedReview || null,
      redirected_to_google: redirectedToGoogle,
    }),
    supabase.from('campaigns').update({
      total_reviews: campaign.total_reviews + 1,
      total_rating: campaign.total_rating + rating,
      positive_redirects: campaign.positive_redirects + (redirectedToGoogle ? 1 : 0),
      negative_feedbacks: campaign.negative_feedbacks + (redirectedToGoogle ? 0 : 1),
    }).eq('id', campaignId),
  ]);

  res.json({ redirect: redirectedToGoogle ? campaign.google_review_link : null });
}
