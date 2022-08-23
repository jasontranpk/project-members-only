const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
	firstName: { type: String, required: true, maxLength: 100 },
	lastName: { type: String, required: true, maxLength: 100 },
	username: { type: String, required: true, maxLength: 100 },
	password: { type: String, required: true, maxLength: 100 },
	membershipStatus: { type: String, maxLength: 100 },
	isAdmin: { type: Boolean },
});

userSchema.virtual('url').get(function () {
	return `/members/${this._id}`;
});
userSchema.virtual('fullName').get(function () {
	return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model('User', userSchema);
