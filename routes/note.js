// route note
var router = require('express').Router();
var note = require('../controllers/note');
router.get('/:id', note.find);
router.post('/', note.create);
router.delete('/:id', note.delete);
module.exports = router;
