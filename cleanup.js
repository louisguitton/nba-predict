//This code requires mongoose node module
var mongoose = require('mongoose');

//connecting local mongodb database named test
// var db = mongoose.connect('mongodb://louis:admin@ds051575.mlab.com:51575/nba-lgu');
var db = mongoose.connect('mongodb://localhost/nba');

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
	score_home : Number,
	rest_time_home : Date,
	rest_time_away : Date,
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

var cleanUpOdds = function(){
	var query = {$or:[{odd_home :{$lt:-50}},{odd_away :{$gt:50}}]};

	Game.find(query, function(err, games){
		if (err) return (err);
		// console.log(games)
		for (var idx in games){
			var game = games[idx];
			game.odd_home = convertOdd(game.odd_home);
			game.odd_away = convertOdd(game.odd_away);
			console.log(game.odd_home);
			game.save(function (err) {
				if (err) return handleError(err);
			}
		);
	}
});
}
cleanUpOdds();

var teams = require('./teams.json');
var restDays = function(){
	for (var t in teams){
		var team = teams[t];
		// var query = {$or:[{home_team : team.name },{away_team : team.name}]};
		// I SHOULD USE query because I want to compute the time between 2 any games of a given team.
		// but even with the simplification below, I can't make it work
		Game.find({home_team : team.name }).sort({date_time:-1}).exec(function(err,gamesOfTeam){
			if (err) return (err);
			// console.log(gamesOfTeam)
			for(var idx=0;i=gamesOfTeam.length-2;i++){
				console.log(gamesOfTeam[idx])
				gamesOfTeam[idx].rest_time_home = gamesOfTeam[idx].date_time-gamesOfTeam[idx+1].date_time;
				// gamesOfTeam[idx].save();
			}
		});
		Game.find({away_team : team.name}).sort({date_time:-1}).exec(function(err,gamesOfTeam){
			if (err) return (err);
			// console.log(gamesOfTeam)
			for(var idx=0;i=gamesOfTeam.length-2;i++){
				gamesOfTeam[idx].rest_time_away = gamesOfTeam[idx].date_time-gamesOfTeam[idx+1].date_time;
				// gamesOfTeam[idx].save();
			}
		});
	}
};

restDays();
