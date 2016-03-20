//This code requires mongoose node module
var mongoose = require('mongoose');
var Game = require('./models/Game')

//connecting local mongodb database named test
// var db = mongoose.connect('mongodb://louis:admin@ds051575.mlab.com:51575/nba-lgu');
var db = mongoose.connect('mongodb://localhost/nba');

//testing connectivity
mongoose.connection.once('connected', function() {
	console.log("Database connected successfully")
	cleanUpOdds();
	console.log("Odds clean...")
	restDays();
});


function convertOdd(us_odd){
	if (us_odd>=0){
		return us_odd/100 + 1
	}else{
		return -100/us_odd + 1
	}
}

var cleanUpOdds = function(){
	var query = {$or:[{odd_home :{$lt:-50}},{odd_home :{$gt:50}},{odd_away :{$gt:50}},{odd_away :{$lt:-50}}]};

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
			});
		}
	});
}

var teams = require('./data/teams.json');
var restDays = function(){
	for (var t in teams){
		var name = teams[t].name;
		console.log(name)
		var query = {$or:[{home_team : name },{away_team : name}]};
		var games = Game.find(query).sort({date_time:-1});
		games.select('home_team away_team date_time');
		games.exec(function(err,gamesOfTeam){
			if (err) return handleError(err);
			console.log(gamesOfTeam[0]);
			for(var i=0;i<gamesOfTeam.length-1;i++){
				// console.log("gamesOfTeam[i]: " + gamesOfTeam[i])
				var delta = gamesOfTeam[i].date_time-gamesOfTeam[i+1].date_time;
				if(gamesOfTeam[i].home_team==name){
					gamesOfTeam[i].rest_time_home = delta;
					gamesOfTeam[i].save();
				} else if (gamesOfTeam[i].away_team==name) {
					gamesOfTeam[i].rest_time_away = delta;
					gamesOfTeam[i].save();
				}
				// console.log(gamesOfTeam[i].rest_time_home);
			}
		})
	}
}

// can't fucking save rest_time_away
