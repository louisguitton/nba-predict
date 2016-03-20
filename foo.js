// app/models/battle.js

// MONGOOSE QUICKSTARTER GUIDE
// http://mongoosejs.com/docs/index.html

// load the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// IN MONGOOSE EVERYTHING DERIVES FROM SCHEMAS
// define the schema for our battle model
var battleSchema = new Schema({
	title: String,
	description: String,
	streams: [{
		trackedWords: [String]
	}],
	created_by: String
		// startDate: Date,
		// endDate: Date,
});

// methods ======================

// save the user that authored the battle
battleSchema.methods.saveAuthor = function(user) {
	var userID = user._id;
	this.created_by = userID;
};

// COMPILE THE SCHEMA INTO A MODEL
// create the model for users and expose it to our app
var Battle = mongoose.model('Battle', battleSchema);
// A model is a class with which we construct documents.
// later, Documents are instances of the model

module.exports = Battle;
