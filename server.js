var express = require('express');
var logger = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var app = express();

var PORT = process.env.PORT || 3000;

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));

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
  'mongodb://heroku_wjqkjs6jroot@ds157654.mlab.com:57654/heroku_wjqkjs6j',
  { useNewUrlParser: true }
);
// mongoose.connect(
//   process.env.MONGODB_URI || 'mongodb://localhost/unit18Populater');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Connected to Mongoose!');
});
// get routes
var routes = require('./controllers/controller');
app.use('/', routes);

// Start the server
app.listen(PORT, function () {
  console.log('Listening on port ' + PORT + '!');
});
