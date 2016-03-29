var mongoose = require('mongoose');
var Game = require('./models/Game')
var db = mongoose.connect('mongodb://localhost/nba');

/*
var query = Game.findOne();
query.exec(function(err, game){
console.log(game.home_team + " against " + game.away_team);
});
*/

var teams = require('./data/teams.json');

var t = 0;
var g = 0;

function loop_on_teams(){
  if(t < teams.length){
    var name = teams[t].name;
    var q = {$or:[{home_team : name },{away_team : name}]};
    console.log(t + " " + name);
    var query = Game.find(q);
    query.sort({date_time: -1}).select('home_team away_team rest_time_home rest_time_away odd_home odd_away');
    query.exec(function(err, games){
      console.log(games.length)

      loop_on_games(name, games);

      t ++;
      g = 0;
      loop_on_teams();
    });
  }
}

function loop_on_games(team_name, games_array){
  if (g < games_array.length - 1){
    if (games_array[g].home_team == team_name){
      if (games_array[g+1].home_team == team_name){
        games_array[g].odd_point_home = (games_array[g].odd_home - games_array[g+1].odd_home)/games_array[g].rest_time_home;
        games_array[g].odd_prim_home = 0.5 * games_array[g].rest_time_home * (games_array[g].odd_home + games_array[g+1].odd_home);
      } else if (games_array[g+1].away_team == team_name) {
        games_array[g].odd_point_home = (games_array[g].odd_home - games_array[g+1].odd_away)/games_array[g].rest_time_home;
        games_array[g].odd_prim_home = 0.5 * games_array[g].rest_time_home * (games_array[g].odd_home + games_array[g+1].odd_away);
      }
    } else if (games_array[g].away_team == team_name){
      if (games_array[g+1].home_team == team_name){
        games_array[g].odd_point_away = (games_array[g].odd_away - games_array[g+1].odd_home)/games_array[g].rest_time_away;
        games_array[g].odd_prim_away = 0.5 * games_array[g].rest_time_away * (games_array[g].odd_away + games_array[g+1].odd_home);
      } else if (games_array[g+1].away_team == team_name) {
        games_array[g].odd_point_away = (games_array[g].odd_away - games_array[g+1].odd_away)/games_array[g].rest_time_away;
        games_array[g].odd_prim_away = 0.5 * games_array[g].rest_time_away * (games_array[g].odd_away + games_array[g+1].odd_away);
      }
    }
    // console.log(games_array[g]);
    games_array[g].save();
    // console.log("Looped realised for game " + g);
    g ++;
    loop_on_games(team_name, games_array);
  }
}

loop_on_teams();
