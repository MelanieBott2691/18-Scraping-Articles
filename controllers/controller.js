//dependencies
var express = require('express');
var router = express.Router();
var path = require('path');

//require request and cheerio to scrape
var request = require('request');
var cheerio = require('cheerio');

//Require models
var Comment = require('../models/Note');
var Article = require('../models/Article');

//index
router.get('/', function (req, res) {
  res.redirect('/articles');
});

router.get('/scrape', function (req, res) {
  axios.get('http://www.kotaku.com/').then(function (response) {
    var $ = cheerio.load(response.data);
    $('article h2').each(function (i, element) {
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this).children('a').text();
      result.link = $(this).children('a').attr('href');

      //ensures that no empty title or links are sent to mongodb
      if (result.title !== '' && result.link !== '') {
        //check for duplicates
        if (titlesArray.indexOf(result.title) == -1) {
          // push the saved title to the array
          titlesArray.push(result.title);

          // only add the article if is not already there
          Article.count({ title: result.title }, function (err, test) {
            //if the test is 0, the entry is unique and good to save
            if (test == 0) {
              //using Article model, create new object
              var entry = new Article(result);

              //save entry to mongodb
              entry.save(function (err, doc) {
                if (err) {
                  console.log(err);
                } else {
                  console.log(doc);
                }
              });
            }
          });
        }
        // Log that scrape is working, just the content was missing parts
        else {
          console.log('Article already exists.');
        }
      }
      // Log that scrape is working, just the content was missing parts
      else {
        console.log('Not saved to DB, missing data');
      }
    });
    // after scrape, redirects to index
    res.redirect('/');
  });
});

// Route for getting all Articles from the db
router.get('/articles', function (req, res) {
  db.Article.find({})
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});
// //this will grab every article an populate the DOM
// router.get('/articles', function (req, res) {
//   //allows newer articles to be on top
//   Article.find()
//     .sort({ _id: -1 })
//     //send to handlebars
//     .exec(function (err, doc) {
//       if (err) {
//         console.log(err);
//       } else {
//         var artcl = { article: doc };
//         res.render('index', artcl);
//       }
//     });
// });

// Route for grabbing a specific Article by id, populate it with it's note
router.get('/articles/:id', function (req, res) {
  db.Article.findOne({ _id: req.params.id })
    .populate('note')
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});
// // This will get the articles we scraped from the mongoDB in JSON
// router.get('/articles-json', function (req, res) {
//   Article.find({}, function (err, doc) {
//     if (err) {
//       console.log(err);
//     } else {
//       res.json(doc);
//     }
//   });
// });

//clear all articles for testing purposes
router.get('/clearAll', function (req, res) {
  Article.remove({}, function (err, doc) {
    if (err) {
      console.log(err);
    } else {
      console.log('removed all articles');
    }
  });
  res.redirect('/articles-json');
});

router.post('/articles/:id', function (req, res) {
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

// router.get('/readArticle/:id', function (req, res) {
//   var articleId = req.params.id;
//   var hbsObj = {
//     article: [],
//     body: []
//   };

// //find the article at the id
Article.findOne({ _id: articleId })
  .populate('comment')
  .exec(function (err, doc) {
    if (err) {
      console.log('Error: ' + err);
    } else {
      hbsObj.article = doc;
      var link = doc.link;
      //grab article from link
      request(link, function (error, response, html) {
        var $ = cheerio.load(html);

        $('.').each(function (i, element) {
          hbsObj.body = $(this)
            .children('.c-entry-content')
            .children('p')
            .text();
          //send article body and comments to article.handlbars through hbObj
          res.render('article', hbsObj);
          //prevents loop through so it doesn't return an empty hbsObj.body
          return false;
        });
      });
    }
  });

// Create a new note
router.post('/note/:id', function (req, res) {
  var user = req.body.name;
  var content = req.body.note;
  var articleId = req.params.id;

  //submitted form
  var noteObj = {
    name: user,
    body: content
  };

  //using the Comment model, create a new comment
  var newNote = new Note(noteObj);

  newNote.save(function (err, doc) {
    if (err) {
      console.log(err);
    } else {
      console.log(doc._id);
      console.log(articleId);
      Article.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { comment: doc._id } },
        { new: true }
      )
        //execute everything
        .exec(function (err, doc) {
          if (err) {
            console.log(err);
          } else {
            res.redirect('/readArticle/' + articleId);
          }
        });
    }
  });
});

module.exports = router;
