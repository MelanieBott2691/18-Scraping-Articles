var db = require('../models');

module.exports = function (app) {
  app.put('/articles/:id', function (req, res) {
    db.Article.update({ _id: req.params.id }, { saved: req.body.saved }).then(
      function (data) {
        res.json(data);
      }
    );
  });

  app.post('/articles/:id', function (req, res) {
    db.Note.create(req.body)
      .then(function (dbNote) {
        return db.Article.findOneAndUpdate(
          { _id: req.params.id },
          { $push: { note: dbNote._id } },
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

  app.delete('/notes/:id', function (req, res) {
    db.Note.deleteOne({ _id: req.params.id }).then(function (dbNotes) {
      res.json(dbNotes);
    });
  });
};
