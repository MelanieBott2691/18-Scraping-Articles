var express = require('express');
// var bodyParser = require('body-parser');
// var logger = require('morgan');
var mongoose = require('mongoose');
var cheerio = require('cheerio');
var axios = require('axios');
var db = require('./models');

var PORT = process.env.PORT || 3000;
var app = express();

// app.use(logger('dev'));
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
// app.get('/', function (req, res) {
//   res.sendFile(path.join(__dirname + './public/index.html'));
// });
var exphbs = require('express-handlebars');

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function () {
//   console.log('connected to mongoose');
// });
// // require('./routes/route');

var MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/mongoscraper';
// mongodb+srv://user1:<password>@mongoscraper.cfphn.mongodb.net/<dbname>?retryWrites=true&w=majority
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
// // mongoose.connect('mongodb://localhost/unit18Populater', {
// //   useUnifiedTopology: true
// // });

// var routes = require('./controller/controller');
// app.use('/', routes);

// // A GET route for scraping the echoJS website
app.get('/scrape', function (req, res) {
  //   // First, we grab the body of the html with axios
  axios.get('https://kotaku.com/').then(function (response) {
    //     // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    //     // Now, we grab every h2 within an article tag, and do the following:
    $('article').each(function (i, element) {
      //       // Save an empty result object
      var result = {};

      //       // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this).children().children().text();
      result.link =
        'https://www.kotaku.com' +
        $(this).children('a').children('a').attr('href');
      result.summary = $(this).children('p + p').text();
      result.image = $(this).children('div').children('img').attr('src');

      var titleCut = result.title.split('Continue', 1);
      console.log(titleCut);
      result.title = titleCut[0];
      result.summary = result.summary.replace(/ \ /g, '');
      result.title = result.title.replace(/ \ /g, '');
      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function (dbArticle) {
          //           // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function (err) {
          //           // If an error occurred, log it
          console.log(err);
        });
    });
    res.redirect('/');
  });
});

// // Route for getting all Articles from the db
app.get('/', function (err, res) {
  // Grab every document in the Articles collection
  db.Article.find({})
    .then(function (dbArticle) {
      //       // If we were able to successfully find Articles, send them back to the client
      res.render('index', {
        articles: dbArticle
      });
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// // Route for grabbing a specific Article by id, populate it with it's note
app.get('/articles/:id', function (req, res) {
  //   // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({ _id: req.params.id })
    //     // ..and populate all of the notes associated with it
    .populate('comments')
    .then(function (dbArticle) {
      //       // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      //       // If an error occurred, send it to the client
      res.json(err);
    });
});
app.get('/comments/:id', function (req, res) {
  db.Comment.findOne({ _id: req.params.id })
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});

// // Route for saving/updating an Article's associated Note
app.post('/articles/:id', function (req, res) {
  //   // Create a new note and pass the req.body to the entry
  db.Comment.create(req.body)
    .then(function (dbNote) {
      //       // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      //       // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      //       // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { comment: dbComment._id } },
        { new: true }
      );
    })
    .then(function (dbArticle) {
      //       // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      //       // If an error occurred, send it to the client
      res.json(err);
    });
});

// // Start the server
// app.listen(PORT, function () {
//   console.log('App running on port ' + PORT + '!');
// });
