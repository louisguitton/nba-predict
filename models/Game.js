// models/game.js

// MONGOOSE QUICKSTARTER GUIDE
// http://mongoosejs.com/docs/index.html

// load the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// IN MONGOOSE EVERYTHING DERIVES FROM SCHEMAS
// define the schema for our battle model
var gameSchema = new Schema({
	_id : Schema.Types.ObjectId,
	date_time : Date,
	home_team : String,
	away_team : String,
	odd_away : Number,
	score_away : Number,
	odd_home : Number,
	overtime : Boolean,
	score_home : Number,
	rest_time_home : Number,
	rest_time_away : Number,
});

// methods ======================

/*
// save the user that authored the battle
battleSchema.methods.saveAuthor = function(user) {
	var userID = user._id;
	this.created_by = userID;
};
*/

// COMPILE THE SCHEMA INTO A MODEL
// create the model for users and expose it to our app
var Game = mongoose.model('Game', gameSchema);
// A model is a class with which we construct documents.
// later, Documents are instances of the model

module.exports = Game;
