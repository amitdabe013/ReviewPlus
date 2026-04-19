// Thin wrapper for Vercel serverless function calls (AI + review submission).
// All Supabase CRUD is done directly via the supabase client in each page.

const call = async (path, body) => {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
};

export const generateReviews = (businessName, rating) =>
  call('/api/ai', { businessName, rating });

export const submitReview = (campaignId, rating, generatedReview) =>
  call('/api/review', { campaignId, rating, generatedReview });

export const getPublicCampaign = (campaignId) =>
  call('/api/campaign-public', { campaignId });
