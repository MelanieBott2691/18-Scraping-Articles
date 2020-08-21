// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require('axios');
var cheerio = require('cheerio');

// Require all models
var db = require('../models');

module.exports = function (app) {
  app.get('/', function (req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
      .then(function (dbArticle) {
        console.log(dbArticle);
        // If we were able to successfully find Articles, send them back to the client
        res.render('index', { dbArticle });
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  app.get('/saved', function (req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
      .then(function (dbArticle) {
        console.log(dbArticle);
        // If we were able to successfully find Articles, send them back to the client
        res.render('saved', { dbArticle });
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
};
