const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  campaign: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
  answers: {
    experience: { type: String },
    liked: { type: String },
    improvements: { type: String },
  },
  rating: { type: Number, min: 1, max: 5, required: true },
  generatedReview: { type: String },
  redirectedToGoogle: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
