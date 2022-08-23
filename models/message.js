const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
	title: { type: String, required: true, maxLength: 100 },
	text: { type: String, required: true, maxLength: 1000 },
	dateCreated: { type: Date },
	userCreated: { type: Schema.Types.ObjectId, ref: 'User' },
});

messageSchema.virtual('url').get(function () {
	return `/messages/${this._id}`;
});

module.exports = mongoose.model('Message', messageSchema);
