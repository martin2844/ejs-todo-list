// jshint esversion:6

//express and body parser modules
const express = require("express");
const bodyParser = require("body-parser");

//this requires the date.js module, which is just a function that gives today's date
const date = require(__dirname + "/date.js");


const app = express();
var items = ["Wake up", "Write To-Do list"];
var workItems =[];

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


app.get("/", function(req,res) {
let day = date();
//passing listTitle and newListItems via ejs to the final page. list is the ejs file.
res.render("list", {listTitle: day, newListItems: items});
});


app.post("/", (req, res) => {
let item = req.body.newItem;

if(req.body.list === "Work") {
  workItems.push(item);
  res.redirect("/work");
} else {
  items.push(item);
  res.redirect("/");
}





});

app.get("/work", (req, res) => {

  /* same as the other app.get but it renders a work list, which features a different
  array, which is empty.
  This shows the use of EJS templating, ie, the daily todo list, and the work todolist are rendered from the same
  ejs file, which is list.ejs, but we change the arguments passed on to the list.ejs template via the listTitle and the
  array after it.

  So that gives the result of two similar pages, which use the template, but are different in content.,

  You can access it by going to the directory /work , thats the route.
  */
  
  res.render("list", {listTitle: "Work List", newListItems: workItems});
} );

//Just testing another route, this time the file is blank,
app.get("/about", (req, res) => {
res.render("about");
});


app.listen(process.env.PORT || 3000, () => {
  console.log("Server Started on port 3000");
});
