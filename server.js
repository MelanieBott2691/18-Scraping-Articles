var express = require('express');
var logger = require('morgan');
var mongoose = require('mongoose');
var exphbs = require('express-handlebars');

var PORT = process.env.PORT || 3000;
var app = express();

app.use(logger('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + 'public'));
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

require('./routes/route');

var MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost/unit18Populater';

// mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
mongoose.connect('mongodb://localhost/unit18Populater', {
  useNewUrlParser: true
});

// Start the server
app.listen(PORT, function () {
  console.log('Listening on port ' + PORT + '!');
});
module.exports = app;
