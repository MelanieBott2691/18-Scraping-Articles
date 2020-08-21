// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require('axios');
var cheerio = require('cheerio');

// Require all models
var db = require('../models');

module.exports = function (app) {
  // A GET route for scraping the website
  app.get('/scrape', function (req, res) {
    // Making a request via axios for `hackerrank.com`'s blog
    axios.get('https://blog.hackerrank.com/').then(function (response) {
      // Load the body of the HTML into cheerio
      var $ = cheerio.load(response.data);

      // With cheerio, find each ul-tag and loop through the results
      $('ul.blog-list')
        .children()
        .each(function (i, element) {
          // Save an empty result object
          var result = {};

          // Save the text of the a-tag as "title"
          result.title = $(this).find('a').text();

          // Find the li tag's href value as "link"
          result.link = $(this).find('a').attr('href');

          // Find the li tag's href value as "link"
          result.text = $(this).find('p').text();

          // Create a new Article using the `result` object built from scraping
          db.Article.create(result)
            .then(function (dbArticle) {
              // View the added result in the console
              console.log(dbArticle);
            })
            .catch(function (err) {
              // If an error occurred, log it
              console.log(err);
            });
        });

      res.redirect('/');
    });
  });

  //ARTICLES

  // Route for getting all Articles from the db
  app.get('/articles', function (req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
      .then(function (dbArticle) {
        // If we were able to successfully find Articles, send them back to the client
        res.json(dbArticle);
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  // Route for grabbing a specific Article by id, populate it with it's note
  app.get('/articles/:id', function (req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.findOne({ _id: req.params.id })
      // ..and populate all of the notes associated with it
      .populate('note')
      .then(function (dbArticle) {
        // If we were able to successfully find an Article with the given id, send it back to the client
        res.json(dbArticle);
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  //get route to update an Article's 'saved' boolean to true
  app.get('/save/:id', function (req, res) {
    db.Article.update({ _id: req.params.id }, { saved: true })
      .then(function (result) {
        res.redirect('/');
      })
      .catch(function (err) {
        res.json(err);
      });
  });

  //delete route to remove an article from saved page
  app.delete('/deleteArticle/:id', function (req, res) {
    db.Article.remove({ _id: req.params.id })
      .then(function (result) {
        res.json(result);
      })
      .catch(function (err) {
        res.json(err);
      });
  });

  //NOTES

  //get route to retrieve all notes for a particlular article
  app.get('/getNotes/:id', function (req, res) {
    db.Article.findOne({ _id: req.params.id })
      .populate('notes')
      .then(function (results) {
        res.json(results);
      })
      .catch(function (err) {
        res.json(err);
      });
  });

  //get route to return a single note to view it
  app.get('/getSingleNote/:id', function (req, res) {
    db.Note.findOne({ _id: req.params.id })
      .then(function (result) {
        res.json(result);
      })
      .catch(function (err) {
        res.json(err);
      });
  });

  //post route to create a new note in the database
  app.post('/createNote', function (req, res) {
    let { title, body, articleId } = req.body;
    let note = {
      title,
      body
    };
    db.Note.create(note)
      .then(function (result) {
        db.Article.findOneAndUpdate(
          { _id: articleId },
          { $push: { notes: result._id } },
          { new: true }
        )
          .then(function (data) {
            res.json(result);
          })
          .catch(function (err) {
            res.json(err);
          });
      })
      .catch(function (err) {
        res.json(err);
      });
  });

  //post route to delete a note
  app.post('/deleteNote', function (req, res) {
    let { articleId, noteId } = req.body;
    db.Note.remove({ _id: noteId })
      .then(function (result) {
        res.json(result);
      })
      .catch(function (err) {
        res.json(err);
      });
  });
};
