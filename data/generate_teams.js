//This code requires mongoose node module
var mongoose = require('mongoose');

//connecting local mongodb database named test
// var db = mongoose.connect('mongodb://louis:admin@ds051575.mlab.com:51575/nba-lgu');
var db = mongoose.connect('mongodb://localhost/nba');

//testing connectivity
mongoose.connection.once('connected', function() {
	console.log("Database connected successfully")
});

var Schema = mongoose.Schema;

var teamSchema = new Schema({
	id : Schema.Types.ObjectId,
	name : String,
	conference : String,
	division : String
});
var Team = mongoose.model('teams',teamSchema);

var teams = require('teams.json');
for (var t in teams){
  var team = new Team(teams[t]);
  console.log(team);
  team.save(function (err) {
    if (err) return handleError(err);
  });
}

module.exports = Team;
