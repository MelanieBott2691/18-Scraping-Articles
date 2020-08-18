// var axios = require('axios')
// var cheerio = require('cheerio')
// var mongoose = require('mongoose')

// // If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
// var MONGODB_URI =
//   process.env.MONGODB_URI || 'mongodb://localhost/mongoHeadlines'

// // Connect to the Mongo DB
// mongoose.connect(MONGODB_URI, { useNewUrlParser: true }, function (error) {
//   if (error) {
//     console.log(error)
//   } else {
//     console.log('mongoose connection is successful')
//   }
// })

// var db = require('../models')

// module.exports = function (app) {
//   // Render pages with scraped articles from database
//   app.get('/', function (req, res) {
//     db.Article.find({ saved: false }, function (error, articles) {
//       var hbsObject = {
//         article: articles
//       }
//       console.log(hbsObject)
//       res.render('index', hbsObject)
//     })
//   })

//   // Render pages with saved articles
//   app.get('/saved', function (req, res) {
//     db.Article.find({ saved: true })
//       .populate('comments')
//       .exec(function (error, articles) {
//         var hbsObject = {
//           article: articles
//         }
//         res.render('saved', hbsObject)
//       })
//   })

//   // Route for getting all Articles from the db
//   app.get('/articles', function (req, res) {
//     // Grab every document in the Articles collection
//     db.Article.find({})
//       .then(function (dbArticle) {
//         // If we were able to successfully find Articles, send them back to the client
//         res.json(dbArticle)
//       })
//       .catch(function (err) {
//         // If an error occurred, send it to the client
//         res.json(err)
//       })
//   })

//   app.get('/scrape', function (req, res) {
//     console.log('scrapping...')
//     // Get HTML body
//     axios.get('https://www.kotaku.com/').then(function (response) {
//       var $ = cheerio.load(response.data)

//       // Get every h2 within article tag
//       $('#articles').each(function (i, element) {
//         var result = {}

//         // Get the text and href of every link, save them as properties of the result object.
//         var headline = $(element)
//           .find('h6')
//           .text()
//         var url = $(element)
//           .find('h6')
//           .children('a')
//           .attr('href')
//         var summary = $(element)
//           .find('body')
//           .children('p')
//           .text()
//         var date = $(element)
//           .find('div.post-meta')
//           .children('p')
//           .children('span.updated')
//           .text()
//         var image = $(element)
//           .find('a.featured-image')
//           .children('img')
//           .attr('src')

//         // console.log("headline:" + headline);
//         // console.log("url: " + url);
//         // console.log("summary: " + summary);
//         // console.log("date: " + date);

//         result.headline = headline
//         result.url = url
//         result.summary = summary
//         result.date = date
//         result.image = image

//         db.Article.create(result)
//           .then(function (dbArticle) {
//             console.log('creating article: ' + dbArticle)
//           })
//           .catch(function (err) {
//             console.log(err)
//           })
//       })

//       // Send a message to the client
//       res.send('Scrape Complete')
//     })
//   })

//   // Route to save an Article
//   app.post('/saved/:id', function (req, res) {
//     // Update the Article's boolean "saved" state to "true"
//     db.Article.update({ _id: req.params.id }, { saved: true })
//       .then(function (dbArticle) {
//         res.json(dbArticle)
//       })
//       .catch(function (error) {
//         res.json(error)
//       })
//   })

//   // Route to delete a saved Article
//   app.post('/delete/:id', function (req, res) {
//     // Update the Article's boolean "saved" state to "false"
//     db.Article.update({ _id: req.params.id }, { saved: false }).then(function (
//       dbArticle
//     ) {
//       res.json(dbArticle)
//     })
//   })

//   // Route to create a Comment
//   app.post('/comments/:articleId', function (req, res) {
//     var id = req.params.articleId
//     var data = req.body

//     db.Comment.create(data)
//       .then(function (dbComment) {
//         return db.Article.findOneAndUpdate(
//           { _id: id },
//           { $push: { comment: dbComment._id } },
//           { new: true }
//         )
//       })
//       .then(function (dbComment) {
//         console.log(dbComment)
//         res.json({ success: true })
//       })
//       .catch(function (err) {
//         console.log(err)
//       })
//   })
// }