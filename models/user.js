/* Users model */
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const ReviewSchema = require('./review').review_schema;

// We'll make this model in a different way
const UserSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		minlength: 4,
		trim: true, // trim whitespace
		unique: true,
		}
	,
	password: {
		type: String,
		required: true,
		minlength: 4
	},
    joinDate: Date,
    reviews: [ReviewSchema],
	banned: Boolean
})

// Our own student finding function
UserSchema.statics.findByUsernamePassword = function(username, password) {
	const User = this

	return User.findOne({username: username}).then((user) => {
		if (!user) {
			return Promise.reject()
		}

		return new Promise((resolve, reject) => {
			bcrypt.compare(password, user.password, (error, result) => {
				if (result) {
					resolve(user);
				} else {
					reject();
				}
			})
		})
	})
}

//This function runs before saving user to database
 UserSchema.pre('save', function(next) {
	 const user = this

	 if (user.isModified('password')) {
		 bcrypt.genSalt(10, (error, salt) => {
			 bcrypt.hash(user.password, salt, (error, hash) => {
				 user.password = hash
				 next()
			 })
		 })
	 } else {
		 next();
	 }

 })


const User = mongoose.model('User', UserSchema)

module.exports = { User }
