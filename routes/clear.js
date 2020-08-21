var router = require('express').Router();
var clear = require('../controllers/clear');
router.get('/', clear.cleardb);
module.exports = router;
