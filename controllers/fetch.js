var db = require('../models');
var scrape = require('../scripts/scrape');
module.exports = {
  scrapeHeadlines: function (req, res) {
    return scrape();
  }
};
