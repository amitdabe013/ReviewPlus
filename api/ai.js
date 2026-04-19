import { GoogleGenerativeAI } from '@google/generative-ai';

const TONE = {
  5: 'thrilled — outstanding visit, exceeded every expectation',
  4: 'happy and satisfied — genuinely good experience',
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { businessName, rating } = req.body;
  if (!rating) return res.status(400).json({ error: 'rating is required' });
  if (rating <= 3) return res.json({ reviews: [] });

  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const tone = TONE[rating] || 'positive and satisfied';
    const prompt = `Write 4 different Google reviews for a business called "${businessName}".
Rating: ${rating}/5 stars
Tone: ${tone}

Rules:
- Each review is 2-3 sentences
- Each review focuses on a different topic: food, service, ambience, staff
- Sound like a real customer
- No repeated openers or phrases

Format as a numbered list:
1. [review]
2. [review]
3. [review]
4. [review]`;

    const result = await model.generateContent(prompt);
    const raw = result.response.text().trim();

    const reviews = raw
      .split('\n')
      .map((line) => line.replace(/^\d+[\.\)]\s*/, '').trim())
      .filter((line) => line.length > 20)
      .slice(0, 4);

    if (reviews.length === 0) return res.status(500).json({ error: 'Failed to generate reviews' });
    res.json({ reviews });
  } catch (err) {
    console.error('AI error:', err.message);
    res.status(503).json({ error: 'AI service temporarily unavailable.' });
  }
}
