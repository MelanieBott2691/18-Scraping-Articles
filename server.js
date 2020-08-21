var express = require('express');
var exphbs = require('express-handlebars');

var mongoose = require('mongoose');

var PORT = process.env.PORT || 3000;
// initialize express
var app = express();
// get routes
var routes = require('./routes');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// If deployed, use the deployed database. Otherwise use the local mongoArticles database
var MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost/mongoHeadlines';

// Connect to the Mongo DB
// mongoose.Promise = Promise;
mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Database Connection Successful!!'))
  .catch((err) => console.error(err));
mongoose.set('useCreateIndex', true);

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use(routes);
// Start the server
app.listen(PORT, function () {
  console.log('Listening on port ' + PORT + '!');
});
