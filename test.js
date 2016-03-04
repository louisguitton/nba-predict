//This code requires mongoose node module
var mongoose = require('mongoose');

//connecting local mongodb database named test
var db = mongoose.connect('mongodb://admin:root@ds051575.mlab.com:51575/nba-lgu');



//testing connectivity
mongoose.connection.once('connected', function() {
	console.log("Database connected successfully")
});

// Defining the schema
var Schema = mongoose.Schema;
var gameSchema = new Schema({
	_id : Schema.Types.ObjectId,
	date_time : Date,
	home_team : String,
	away_team : String,
	odd_away : Number,
	score_away : Number,
	odd_home : Number,
	overtime : Boolean,
	score_home : Number
});

// Creating the model
var Game = mongoose.model('games', gameSchema);

function convertOdd(us_odd){
	if (us_odd>=0){
		return us_odd/100 + 1
	}else{
		return -100/us_odd + 1
	}
}


var query = {$or:[{odd_home :{$lt:-50}},{odd_away :{$gt:50}}]};
// var query2 = {odd_winner : {$or:[{$lt:-50},{$gt:50}]}}


result = Game.find(query, function(err, games){
	if (err) return (err);
	for each game in games

})

// I just want to connect to my mongodb/nba/games collection
// then withdraw all games that have US odds (so the query or query2)
// then apply convertOdd to them
// then store them again
// just to FREECKING clean up my DB !!!!
