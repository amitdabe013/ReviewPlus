const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  businessName: { type: String, required: true, trim: true },
  googleReviewLink: { type: String, required: true },
  qrCodeDataUrl: { type: String },
  active: { type: Boolean, default: true },
  stats: {
    totalReviews: { type: Number, default: 0 },
    positiveRedirects: { type: Number, default: 0 },
    negativeFeedbacks: { type: Number, default: 0 },
    totalRating: { type: Number, default: 0 },
  },
}, { timestamps: true });

campaignSchema.virtual('avgRating').get(function () {
  if (this.stats.totalReviews === 0) return 0;
  return (this.stats.totalRating / this.stats.totalReviews).toFixed(1);
});

campaignSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Campaign', campaignSchema);
