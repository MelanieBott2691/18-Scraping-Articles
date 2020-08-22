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
mongoose.connect('mongodb://localhost/unit18Populater', {
  useNewUrlParser: true
});

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost/mongoHeadlines';

// Connect to the Mongo DB
// mongoose.connect(MONGODB_URI);

// Routes
app.get('/scrape', function (req, res) {
  axios.get('http://www.kotaku.com/').then(function (response) {
    var $ = cheerio.load(response.data);
    $('article h2').each(function (i, element) {
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this).children('a').text();
      result.link = $(this).children('a').attr('href');

      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function (dbArticle) {
          console.log(dbArticle);
        })
        .catch(function (err) {
          console.log(err);
        });
    });
    res.send('Scrape Complete');
  });
});

// Route for getting all Articles from the db
app.get('/articles', function (req, res) {
  db.Article.find({})
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get('/articles/:id', function (req, res) {
  db.Article.findOne({ _id: req.params.id })
    .populate('note')
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});

app.post('/articles/:id', function (req, res) {
  db.Note.create(req.body)
    .then(function (dbNote) {
      return db.Article.findOneAndUpdate(
        { _id: req.params.id },
        { note: dbNote._id },
        { new: true }
      );
    })
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});

// Start the server
app.listen(PORT, function () {
  console.log('Listening on port ' + PORT + '!');
});
