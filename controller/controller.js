var express = require('express');
var path = require('path');
var router = express.Router();

var request = require('request');
var cheerio = require('cheerio');

var Note = require('../models/Note');
var Article = require('../models/Article');

router.get('/', function (req, res) {
  res.redirect('/articles');
});

router.get('/scrape', function (req, res) {
  request('http://www.kotaku.com', function (error, response, html) {
    var $ = cheerio.load(html);
    var titlesArray = [];

    // .c-entry-box--compact__title

    $('.sc-1pw4fyi-7 jWkhDT sc-14liz76-1 gtPaRI js_post_item').each(function (
      i,
      element
    ) {
      // "article .sc-1pw4fyi-7"
      // "p .sc-1d3a351-0"
      var result = {};

      result.title = $(this).children('a').text();
      result.link = $(this).children('a').attr('href');

      if (result.title !== '' && result.link !== '') {
        if (titlesArray.indexOf(result.title) == -1) {
          titlesArray.push(result.title);

          Article.count({ title: result.title }, function (err, test) {
            if (test === 0) {
              var entry = new Article(result);

              entry.save(function (err, doc) {
                if (err) {
                  console.log(err);
                } else {
                  console.log(doc);
                }
              });
            }
          });
        } else {
          console.log('Article Already Exists');
        }
      } else {
        console.log('Missing Data');
      }
    });
    res.redirect('/');
  });
});
router.get('/articles', function (req, res) {
  Article.find()
    .sort({ _id: -1 })
    .exec(function (err, doc) {
      if (err) {
        console.log(err);
      } else {
        var artcl = { article: doc };
        res.render('index', artcl);
      }
    });
});
// scrape and put into a json
router.get('/articles-json', function (req, res) {
  Article.find({}, function (err, doc) {
    if (err) {
      console.log(err);
    } else {
      res.json(doc);
    }
  });
});
// remove all artilces when got to endpoint (starts empty)
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
// read article (specific article)
router.get('/readArticle/:id', function (req, res) {
  var articleId = req.params.id;
  var hbsObj = {
    article: [],
    body: []
  };

  Article.findOne({ _id: articleId })
    .populate('note')
    .exec(function (err, doc) {
      if (err) {
        console.log('Error: ' + err);
      } else {
        hbsObj.article = doc;
        var link = doc.link;
        request(link, function (error, response, html) {
          var $ = cheerio.load(html);
          // "article .sc-1pw4fyi-7"
          // "p .sc-1d3a351-0"
          $('div .sc-1pw4fyi').each(function (i, element) {
            hbsObj.body = $(this)
              .children('.p .sc-1d3a351-0')
              .children('p')
              .text();

            res.render('article', hbsObj);
            return false;
          });
        });
      }
    });
});
// area for notes, route post
router.post('/note/:id', function (req, res) {
  var user = req.body.name;
  var content = req.body.note;
  var articleId = req.params.id;

  var noteObj = {
    name: user,
    body: content
  };

  var newNote = new Note(noteObj);

  newNote.save(function (err, doc) {
    if (err) {
      console.log(err);
    } else {
      console.log(doc._id);
      console.log(articleId);

      Article.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { note: doc._id } },
        { new: true }
      ).exec(function (err, doc) {
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
