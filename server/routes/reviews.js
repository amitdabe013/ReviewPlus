const router = require('express').Router();
const Review = require('../models/Review');
const Campaign = require('../models/Campaign');

router.get('/campaign/:campaignId/public', async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.campaignId)
      .select('name businessName active');
    if (!campaign || !campaign.active)
      return res.status(404).json({ message: 'Campaign not found or inactive' });
    res.json(campaign);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/:campaignId', async (req, res) => {
  try {
    const { answers, rating, generatedReview } = req.body;
    if (!rating) return res.status(400).json({ message: 'Rating is required' });

    const campaign = await Campaign.findById(req.params.campaignId);
    if (!campaign || !campaign.active)
      return res.status(404).json({ message: 'Campaign not found' });

    const redirectedToGoogle = rating >= 4;

    const review = await Review.create({
      campaign: campaign._id,
      answers,
      rating,
      generatedReview,
      redirectedToGoogle,
    });

    campaign.stats.totalReviews += 1;
    campaign.stats.totalRating += rating;
    if (redirectedToGoogle) campaign.stats.positiveRedirects += 1;
    else campaign.stats.negativeFeedbacks += 1;
    await campaign.save();

    res.json({
      review,
      redirect: redirectedToGoogle ? campaign.googleReviewLink : null,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
