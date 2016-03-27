var mongoose = require('mongoose');
var Game = require('./models/Game')
var db = mongoose.connect('mongodb://localhost/nba');


var teams = require('./data/teams.json');

var t = 0;
var id_games = 0;

function loop_on_teams(){
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
				// console.log(games[0]);
				console.log(name + " -> " + games.length)

				loop_on_games(name, games);

				t ++;

				id_games = 0;
				loop_on_teams();
			}
		);
	}
}

function loop_on_games(team_name, games_array){
	if (id_games < games_array.length - 1){
		var delta = games_array[id_games].date_time - games_array[id_games + 1].date_time; // already in mms
		if (games_array[id_games].home_team == team_name){
			games_array[id_games].rest_time_home = delta;
			games_array[id_games].save();
			console.log("delta saved for home team");
			id_games ++;
			loop_on_games(team_name, games_array);
		} else if (games_array[id_games].away_team == team_name){
			games_array[id_games].rest_time_away = delta;
			games_array[id_games].save();
			console.log("delta saved for away team");
			id_games ++;
			loop_on_games(team_name, games_array);
		}
	}
}


loop_on_teams();

// mongoose.connection.close()
