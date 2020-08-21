var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

// Require Note and Article models
var Note = require('./models/Note.js');
var Article = require('./models/Article.js');
// var axios = require('axios');
var request = require('request');
var cheerio = require('cheerio');

// Require all models
var db = require('./models');

var PORT = process.env.PORT || 3000;
// initialize express
var app = express();
var routes = require('./routes');

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
app.use(express.static('public'));

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// var Article = require("./models/Article.js");
// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost/mongoHeadlines';

// Connect to the Mongo DB
// mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);
// var results = [];

//Routes
// simple index route
// app.get("/", function(req, res) {
//     res.render("index");
//     // res.sendFile(path.join(__dirname + "./public/index.html"));
// });
// app.get("/scrape", function(req, res) {
//     var found;
//     var titleArticle = [];
//     dbArticle.find({}).then(function(dbArticle) {
//         for (var j = 0; j < dbArticle.length; j++) {
//             titleArticle.push(dbArticle[j].title)
//         }
//         console.log(titleArticle);
//         request("http://www.kotaku.com/", function(error, response, html) {
//             if (!error && response.statusCode == 200) {
//                 console.log(html);
//             }
//             var $ = cheerio.load(html, {
//                 xml: {
//                     normalizeWhitespace: true,
//                 }
//             });
//             $("body h3").each(function(i, element) {
//                 var result = {};
//                 // Add the text and href of every link, and save them as properties of the result object
//                 result.title = $(element).children("a").text();
//                 found = titleArr.includes(result.title);
//                 result.link = $(element).children("a").attr("href");
//                 result.excerpt = $(element).parent().children(".td-excerpt").text().trim();
//                 if (!found && result.title && result.link) {
//                     results.push(result);
//                 }
//             });
//             res.render("scrape", {
//                 articles: results
//             });
//         });
//     });
// });

// Route for getting all Articles from the db
// app.get("/saved", function(req, res) {
//     // Grab every document in the Articles collection
//     db.Article.find({})
//         .then(function(dbArticle) {
//             console.log(dbArticle);
//             res.render("saved", {
//                 saved: dbArticle
//             });
//         })
//         .catch(function(err) {
//             // If an error occurred, send it to the client
//             res.json(err);
//         });
// });

// Route for creating an Article in the db
// app.post("/api/saved", function(req, res) {
//     db.Article.create(req.body)
//         .then(function(dbArticle) {
//             res.json(dbArticle);
//         })
//         .catch(function(err) {
//             // If an error occurred, send it to the client
//             res.json(err);
//         });
// });

// // Route for grabbing a specific Article by id, populate it with it's note
// app.get("/articles/:id", function(req, res) {
//     console.log(req.params.id);
//     // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
//     db.Article.findOne({ _id: req.params.id })
//         // ..and populate all of the notes associated with it
//         .populate("note")
//         .then(function(dbArticle) {
//             // If we were able to successfully find an Article with the given id, send it back to the client
//             console.log(dbArticle);
//             if (dbArticle) {
//                 res.render("articles", {
//                     data: dbArticle
//                 });
//             }
//         })
//         .catch(function(err) {
//             // If an error occurred, send it to the client
//             res.json(err);
//         });
// });

// //Route for deleting an article from the db
// app.delete("/saved/:id", function(req, res) {
//     db.Article.deleteOne({ _id: req.params.id })
//         .then(function(removed) {
//             res.json(removed);
//         }).catch(function(err, removed) {
//             // If an error occurred, send it to the client
//             res.json(err);
//         });
// });

// //Route for deleting a note
// app.delete("/articles/:id", function(req, res) {
//     db.Note.deleteOne({ _id: req.params.id })
//         .then(function(removed) {
//             res.json(removed);
//         }).catch(function(err, removed) {
//             // If an error occurred, send it to the client
//             res.json(err);
//         });
// });

// // Route for saving/updating an Article's associated Note
// app.post("/articles/:id", function(req, res) {
//     // Create a new note and pass the req.body to the entry
//     db.Note.create(req.body)
//         .then(function(dbNote) {
//             db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { note: dbNote._id } }, { new: true })
//                 .then(function(dbArticle) {
//                     console.log(dbArticle);
//                     res.json(dbArticle);
//                 })
//                 .catch(function(err) {
//                     // If an error occurred, send it to the client
//                     res.json(err);
//                 });
//         })
//         .catch(function(err) {
//             res.json(err);
//         });
// });

// Start the server
app.listen(PORT, function () {
  console.log('App running on port ' + PORT + '!');
});
