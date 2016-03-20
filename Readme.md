# NBA game winner predicter
## Python Crawler to generate the Games Collection
The data comes from [Odds Portal](http://www.oddsportal.com/basketball/usa)
The Python crawler uses Scrapy
It connects to MongoDB locally or to mongolab (mongodb://<dbuser>:<dbpassword>@ds051575.mlab.com:51575/nba-lgu)
It uses a rendering middleware Splash deployed on a Docker virtual machine

```bash
mongod
```
```bash
docker run -p 8050:8050 scrapinghub/splash
```
```bash
scrapy crawl nba
```

The Game schema of the resulting DB is described in crawler/nba_odds/itemps.py

## Extract the DB into csv & Generate the Teams Collection
```bash
cd data
sh mongo2csv.h
node generate_teams.js
```

## Admin the DBs
nba MONGODB: user=admin pwd=root
Admin UI admin:pass
```bash
mongo-express -a
```

## Preliminary Analysis with Jupyter Notebooks
```bash
cd analysis
ipython notebook
```
Key findings:
- the odds are sometimes in the US or UK format
- Winner and Looser scores are following gaussians
- winner and looser odds are following a log-normal distribution
- more interesting to use (home, away) rather than (winner, looser)
- the simple classifier "lowest odds wins" as a 70% accuracy

## Cleanup and Feature Engineering
```bash
node cleanup.js
```

## DB Schemas
Game Collection
---------------
Home team
Away team
overtime
score home team
score away team
date and time
how many days of rest for home team
how many days of rest for away team
Pace = number of possessions per game
Efficiency = points / possessions


Equipe Collection
-----------------
conference
division
number of wins
number of losses
rank in conference
rank in division
- effective field goal percentage
- Free throw attempt rate
- turnover ratio
- offensive rebound percentage

## Ideas
There`s a difference between the data you can get after the game (the 4 factors),
and the data you have before the game.
thanks to the stats after the game, you can update your ELO-based model.

pourquoi pas utiliser une chaine de markov pour prédire la prochaine win?
les etats sont les places au classement: on prend une équipe et on regarde quelles est la proba pour cette equipe de rester à ce classement ou bien de bouger
