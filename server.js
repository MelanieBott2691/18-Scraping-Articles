require('dotenv').config();
var express = require('express');
var exphbs = require('express-handlebars');
var logger = require('morgan');
var mongoose = require('mongoose');

var PORT = process.env.PORT || 3000;
// initialize express
var app = express();

app.use(logger('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost/mongoHeadlines';

// Connect to the Mongo DB
// mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Routes
require('./routes/apiRoutes')(app);
require('./routes/htmlRoutes')(app);

// Start the server
app.listen(PORT, function () {
  console.log('Listening on port ' + PORT + '!');
});
