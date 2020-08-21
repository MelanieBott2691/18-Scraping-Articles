var axios = require("axios");
var cheerio = require("cheerio");
var scrape = function() {
    return axios.get("https://kotaku.com/").then(function(res) {
        var $ = cheerio.load(res.data);
        console.log("scraping");
        var articles = [];
        $(".wrapper").each(function(i, element) {
            var head = $(this).find("h2").text().trim();
            var url = $(this).find("a").attr("href");
            var sum = $(this).find("p").text().trim();
            if (head && sum && url) {
                var headReplace = head.replace(/(\r\n|\s+)/gm, " ").trim();
                var sumReplace = sum.replace(/(\r\n|\s+)/gm, " ").trim();
                var addData = {
                    article: headReplace,
                    summary: sumReplace,
                    url: "https://kotaku.com/" + url
                };
                articles.push(addData);
            }
        });
        return articles;
    });
};
module.exports = scrape;