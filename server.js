var express = require('express');
var logger = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
// var axios = require('axios');
// var cheerio = require('cheerio');

var db = require('./models');
var PORT = process.env.PORT || 3000;
var app = express();

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
app.use(express.static(process.cwd() + '/public'));
var exphbs = require('express-handlebars');
app.engine(
  'handlebars',
  exphbs({
    defaultLayout: 'main'
  })
);
app.set('view engine', 'handlebars');
mongoose.connect(
  'mongodb://heroku_wjqkjs6j.user1:root@ds157654.mlab.com:57654/heroku_wjqkjs6j'
);
// mongoose.connect(
//   process.env.MONGODB_URI || 'mongodb://localhost/unit18Populater'
// )
// Connect to the Mongo DB
// mongoose.connect('mongodb://localhost/unit18Populater', {
//   useNewUrlParser: true
// });

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Connected to Mongoose!');
});
var routes = require('./controllers/controller');
app.use('/', routes);

// MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/mongoHeadlines';

// Connect to the Mongo DB
// mongoose.connect(MONGODB_URI);

// Start the server
app.listen(PORT, function () {
  console.log('Listening on port ' + PORT + '!');
});
