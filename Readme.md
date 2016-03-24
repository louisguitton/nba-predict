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
- plot the games on (x,y)=(odd_home,odd_away)
- performed feature scaling
- performed feature mapping (square odds, inverse odds, product of odds, difference of odds)
- trained logistic regression, random forest, SVM with different kernels.
- regularized logistic regression
- plot learning curves

## Cleanup and Feature Engineering
```bash
node cleanup.js
```

## DB Schemas
### Game Collection

|Field|
|-----|
Home team |
Away team |
overtime |
score home team |
score away team |
date and time |
how many days of rest for home team |
how many days of rest for away team |
Pace = number of possessions per game |
Efficiency = points / possessions |

### Team Collection

|Field|
|-----|
conference |
division |
number of wins |
number of losses |
rank in conference |
rank in division |
effective field goal percentage |
Free throw attempt rate |
turnover ratio |
offensive rebound percentage |

## Next steps

- Elo-based model
- markov chain to predict next rank of the team
- trueskills
