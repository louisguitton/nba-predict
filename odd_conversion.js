db.getCollection('games').find({$or:[{odd_winner :{$lt:-50}},{odd_winner :{$gt:50}}]})
