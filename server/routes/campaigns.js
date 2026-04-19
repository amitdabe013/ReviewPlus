const router = require('express').Router();
const QRCode = require('qrcode');
const Campaign = require('../models/Campaign');
const Review = require('../models/Review');
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const campaigns = await Campaign.find({ user: req.user._id }).sort('-createdAt');
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const { name, businessName, googleReviewLink } = req.body;
    if (!name || !businessName || !googleReviewLink)
      return res.status(400).json({ message: 'All fields are required' });

    const campaign = await Campaign.create({
      user: req.user._id,
      name,
      businessName,
      googleReviewLink,
    });

    const reviewUrl = `${process.env.CLIENT_URL}/review/${campaign._id}`;
    const qrCodeDataUrl = await QRCode.toDataURL(reviewUrl, {
      width: 300,
      margin: 2,
      color: { dark: '#0f172a', light: '#ffffff' },
    });

    campaign.qrCodeDataUrl = qrCodeDataUrl;
    await campaign.save();

    res.status(201).json(campaign);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const campaign = await Campaign.findOne({ _id: req.params.id, user: req.user._id });
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });

    const reviews = await Review.find({ campaign: campaign._id })
      .sort('-createdAt')
      .limit(50);

    res.json({ campaign, reviews });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/:id', protect, async (req, res) => {
  try {
    const campaign = await Campaign.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { $set: req.body },
      { new: true }
    );
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });
    res.json(campaign);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    await Campaign.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ message: 'Campaign deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
