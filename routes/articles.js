// route for controller articles
var router = require('express').Router();
var articles = require('../controllers/articles');
router.get('/', articles.findAll);
router.delete('/:id', articles.delete);
router.put('/:id', articles.update);
module.exports = router;
