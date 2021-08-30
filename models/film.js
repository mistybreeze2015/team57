const mongoose = require('mongoose');

const FilmSchema = new mongoose.Schema({
    name: String,
    description: String,
    genre: [String],
    director: [String],
    writer: [String],
    date: Date,
    runtime: Number,
    studio: String,
    type: String,
    score: [Number],
    users: Number,
    img_path: String,
	comment: Object //Note: Added comment for individual movie page - Gj
});

const Film = mongoose.model('Film', FilmSchema);

module.exports = { Film };
