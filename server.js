var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

var PORT = process.env.PORT || 3000;
var app = express();

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
app.use(express.static(process.cwd() + '/public'));
var exphbs = require('express-handlebars');

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('connected to mongoose');
});
// require('./routes/route');

var MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost/unit18Populater';

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
// mongoose.connect('mongodb://localhost/unit18Populater', {
//   useUnifiedTopology: true
// });

var routes = require('./controller/controller');
app.use('/', routes);

// Start the server
app.listen(PORT, function () {
  console.log('Listening on port ' + PORT + '!');
});
