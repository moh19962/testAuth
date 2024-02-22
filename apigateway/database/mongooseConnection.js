var mongoose = require('mongoose');

//connectie opzetten.. En natuurlijk verplaatsen we de string naar de .env
mongoose.connect('mongodb://localhost:27017/Authenticate');



