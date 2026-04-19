const router = require('express').Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

const TONE = {
  5: 'thrilled — outstanding visit, exceeded every expectation',
  4: 'happy and satisfied — genuinely good experience',
};

router.post('/generate', async (req, res) => {
  try {
    console.log('[/generate] req.body:', req.body);

    const { businessName, rating } = req.body;

    if (!rating) {
      return res.status(400).json({ error: 'rating is required' });
    }

    if (rating <= 3) {
      return res.json({ reviews: [], message: 'Thanks for your feedback' });
    }

    const tone = TONE[rating] || 'positive and satisfied';

    const prompt = `Write 4 different Google reviews for a business called "${businessName}".
Rating: ${rating}/5 stars
Tone: ${tone}

Rules:
- Each review is 2-3 sentences
- Each review focuses on a different topic: food, service, ambience, staff
- Sound like a real customer
- No repeated openers or phrases

Format your response as a numbered list, one review per line:
1. [review]
2. [review]
3. [review]
4. [review]`;

    const result = await model.generateContent(prompt);
    const raw = result.response.text().trim();
    console.log('[/generate] Gemini raw response:', raw);

    const reviews = raw
      .split('\n')
      .map((line) => line.replace(/^\d+[\.\)]\s*/, '').trim())
      .filter((line) => line.length > 20)
      .slice(0, 4);

    if (reviews.length === 0) {
      console.error('[/generate] Could not extract reviews. Got:', reviews);
      return res.status(500).json({ error: 'Failed to generate reviews' });
    }

    res.json({ reviews });
  } catch (err) {
    console.error('[/generate] Error:', err.message);
    console.error('[/generate] Full error:', JSON.stringify(err, null, 2));
    if (err.status === 429 || err.message?.includes('429')) {
      return res.status(503).json({ error: 'AI service is temporarily unavailable. Please try again later.' });
    }
    res.status(500).json({ error: 'Failed to generate reviews' });
  }
});

router.post('/generate-review', async (req, res) => {
  try {
    const { businessName, experience, liked, improvements, rating } = req.body;

    const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
    const prompt = `Convert this customer feedback into a polished, authentic Google review.

Business: ${businessName}
Rating: ${stars} (${rating}/5)
Experience: ${experience}
What they liked: ${liked}
${improvements ? `Suggestions: ${improvements}` : ''}

Write a natural 2-4 sentence Google review. Sound like a real customer, not a marketing brochure. Output only the review text.`;

    const result = await model.generateContent(prompt);
    res.json({ review: result.response.text().trim() });
  } catch (err) {
    console.error('Gemini error:', err.message);
    res.status(500).json({ message: 'Failed to generate review' });
  }
});

module.exports = router;
