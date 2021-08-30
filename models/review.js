const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    userID: String,
    movieID: String,
    reviewDate: Date,
    reviewText: String,
    rating: Number,
    img_path: String
});

const Review = mongoose.model('Review', ReviewSchema);

module.exports = { review: Review, review_schema: ReviewSchema };
