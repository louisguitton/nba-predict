var mongoose = require('mongoose');
var Game = require('./models/Game')
var db = mongoose.connect('mongodb://localhost/nba');

// mongoose.connection.once('connected', function() {
// 	console.log("Database connected successfully")
//   console.log("Computing restDays")
// 	restDays();
// 	// mongoose.connection.close()
// });

var teams = require('./data/teams.json');
// var restDays = function(){
// var counter_games = 0;

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
			var delta = gamesOfTeam[i].date_time-gamesOfTeam[i+1].date_time;// already in mms
			if(gamesOfTeam[i].home_team==name){
				gamesOfTeam[i].rest_time_home = delta;
				gamesOfTeam[i].save();
				console.log("delta saved for home team")
				// counter_games ++;
			} else if (gamesOfTeam[i].away_team==name) {
				gamesOfTeam[i].rest_time_away = delta;
				gamesOfTeam[i].save();
				console.log("delta saved for away team")
				// counter_games ++;
			}
		}
	})
}

// console.log(counter_games + " games modified...")
// }
