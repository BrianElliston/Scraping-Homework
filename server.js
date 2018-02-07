var express = require("express");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var cheerio = require("cheerio");
var request = require("request");
var mongojs = require("mongojs");
var logger = require("morgan");
var axios = require("axios");
var db = require("./models")
// Initialize Express
var app = express();

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');



var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Database configuration
var databaseUrl = "scraper";
var collections = ["scrapeData"];


// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));


// Main route 
app.get("/", function (req, res) {
  // db.Article.find({})
  // .then(function(art){
  //   res.render("index", {articles: art});
  // })
  // .catch(function(err) {
  //   // If an error occurs, send the error back to the client
  //   res.json(err);
  // });
   res.send("Hello THere")
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
            var result ={};
            result.title = title;
            result.link = link;
        if (title && link) {
          db.Article.create({
            result
          },
          function(err, inserted){
  
            if(err){
              console.log(err);
            }
            else{
              console.log(inserted); 
              // res.render("index", {articles: inserted});
              res.send("Scrape finished")
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