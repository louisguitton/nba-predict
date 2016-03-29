var mongoose = require('mongoose');
var Game = require('./models/Game')
var db = mongoose.connect('mongodb://localhost/nba');


var teams = require('./data/teams.json');

var t = 0;// t like team
var g = 0;// g like game

function loop_on_teams(){
	if (t < teams.length){
		var name = teams[t].name;
		var q = {$or:[{home_team : name },{away_team : name}]};
		console.log(t + " " + name);
		var query = Game.find(q);
		query.sort({date_time:-1});
		query.select('home_team away_team date_time');
		query.exec('find',
			//callback
			function(err, games){
				if (err) return console.log(err);
				console.log(name + " -> " + games.length)

				loop_on_games(name, games);

				t ++;
				g = 0;
				loop_on_teams();
			}
		);
	}
}

function loop_on_games(team_name, games_array){
	if (g < games_array.length - 1){
		var delta = games_array[g].date_time - games_array[g + 1].date_time; // already in mms
		mms_in_a_day = 24 * 60 * 60 * 1000;
		delta = delta / mms_in_a_day; // in days
		if (games_array[g].home_team == team_name){
			games_array[g].rest_time_home = delta;
		} else if (games_array[g].away_team == team_name){
			games_array[g].rest_time_away = delta;
		}
		games_array[g].save();
		console.log("delta saved for home team");
		g ++;
		loop_on_games(team_name, games_array);
	}
}


loop_on_teams();

// mongoose.connection.close()
