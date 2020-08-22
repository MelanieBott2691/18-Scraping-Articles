var express = require('express');
var logger = require('morgan');
var mongoose = require('mongoose');
// var bodyParser = require('body-parser');

var PORT = process.env.PORT || 3000;
var app = express();

app.use(logger('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

var MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost/unit18Populater';
var exphbs = require('express-handlebars');

// mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
mongoose.connect('mongodb://localhost/unit18Populater', {
  useNewUrlParser: true
});

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

require('./routes')(app);

// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/unit18Populater');
// var databaseUri = 'mongodb://localhost/nhlscrape';
// if (process.env.MONGODB_URI) {
//   mongoose.connect(process.env.MONGODB_URI);
// } else {
//   mongoose.connect(databaseUri);
// }
// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function () {
//   console.log('Connected to Mongoose!');
// });

// Start the server
app.listen(PORT, function () {
  console.log('Listening on port ' + PORT + '!');
});
