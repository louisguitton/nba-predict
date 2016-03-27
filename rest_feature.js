var mongoose = require('mongoose');
var Game = require('./models/Game')
var db = mongoose.connect('mongodb://localhost/nba');


var teams = require('./data/teams.json');

var t = 0;

function loop(){
	if (t < teams.length){
		var name = teams[t].name;
		var query = {$or:[{home_team : name },{away_team : name}]};
		console.log(t + " " + name);
		var games = Game.find(query);
		games = games.sort({date_time:-1});
		games = games.select('home_team away_team date_time');
		games = games.exec('find',
			//callback
			function(err, games){
				if (err) return console.log(err);
				console.log(games[0]);
				console.log(t + " -> " + games.length)
				t ++;
				loop();
			}
		);
	}
}

loop();

// for (var t = 0; t < teams.length; t++){


// problem with the for each asynchronous node

// mongoose.connection.close()


// handleError = (err) ->
//   console.log "Got an error", err
// mongoose.connection.once('connected', function() {
// 	console.log("Database connected successfully")
//   console.log("Computing restDays")
// 	restDays();
// 	// mongoose.connection.close()
// });

// var restDays = function(){
// var counter_games = 0;
/*
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
*/


// console.log(counter_games + " games modified...")
// }
