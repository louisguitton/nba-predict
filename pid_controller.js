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

        loop_on_games(games);

        t ++;
        g = 0;
        loop_on_teams();
      });
    }
}

function loop_on_games(games_array){
  if (g < games_array.length){
    games_array[g].odd_point_home = ;
    games_array[g].odd_point_away = ;
    games_array[g].odd_prim_home = ;
    games_array[g].odd_prim_away = ;


    games_array[g].save();
    console.log("Looped realised for game " + g);
    g ++;
    loop_on_games(games_array);
  }
}


loop_on_teams();

/*
The idea here is to take each game and generate four features:
- odd_point_home,
- odd_point_away,
- odd_prim_home,
- odd_prim_away

ODD_POINT:
Euler method: odd_point_home[i] = odd_home[i] - odd_????[i+1]/rest_time_home

ODD_PRIM:
Méthode des trapèzes: odd_prim_home[i] = 0.5 * rest_time_home * (odd_home[i] + odd_????[i+1])
*/
