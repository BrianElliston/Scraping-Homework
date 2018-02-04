

var express = require("express");
var exphbs = require("express-handlebars");
var goose = require("mongoose");
var body = require("body-parser");
var cheerio = require("cheerio");
var request = require("request");
var mongojs = require("mongojs");

// Initialize Express
var app = express();

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');



var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Database configuration
var databaseUrl = "scraper";
var collections = ["scrapedData"];





// Main route (simple Hello World Message)
app.get("/", function (req, res) {
    res.render("index");
  });

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function (error) {
  console.log("Database Error:", error);
});

// This route will retrieve all of the data
// from the scrapedData collection as a json (this will be populated
// by the data you scrape using the next route)
app.get("/scrape", function (req, res) {
    console.log("hello world")
    request("https://www.wncmagazine.com/", function (error, response, html) {
      var $ = cheerio.load(html);
      $(".field-content").each(function(i, element) {
        
            var link = $(element).children().attr("href");
            var title = $(element).children().text();
            var summary = $(element).parent().find("div.field-content").text();
            // Save these results in an object that we'll push into the results array we defined earlier
            
        if (title && link) {
          db.scrapeData.insert({
            title: title,
            link: link
            
          },
          function(err, inserted){
  
            if(err){
              console.log(err);
            }
            else{
              console.log(inserted);
            }
          });
        }
      });
    });
  
  })


// Listen on port 3000
app.listen(3000, function () {
    console.log("App running on port 3000!");
  });