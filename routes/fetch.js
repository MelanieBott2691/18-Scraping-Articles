// router for fetch controller
var router = require('express').Router();
var fetch = require('../controllers/fetch');
router.get('/', fetch.scrapeArticle);
module.exports = router;
