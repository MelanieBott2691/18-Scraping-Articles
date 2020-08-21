// route all
var router = require('express').Router();
var fetch = require('./fetch');
var articles = require('./articles');
var clear = require('./clear');
var note = require('./note');

router.get('/fetch', fetch);
router.get('/artciles', articles);
router.get('/clear', clear);
router.get('/note', note);
module.exports = router;
