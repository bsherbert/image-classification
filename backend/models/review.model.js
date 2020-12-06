const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    width: {type: Number, required: true},
    height: {type: Number, required: true},
    label: {type: String, required: true},
    pixels: {type: String, required: true},
}, {
    timestamps: true,
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;