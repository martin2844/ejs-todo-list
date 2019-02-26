// jshint esversion:6

//express and body parser modules
const express = require("express");
const bodyParser = require("body-parser");

// 1st require mongoose
const mongoose = require('mongoose');

//this requires the date.js module, which is just a function that gives today's date
const date = require(__dirname + "/date.js");


const app = express();


app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


/*MONGODB  ---- INTEGRATION*/

//connect to mongoDB database
mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true});
//create the schema for the items.
const itemSchema = new mongoose.Schema ({
  name: String,

});
//create the mongoose model
const Item = mongoose.model('Item', itemSchema);

// default items constants. Theese are all
const item1 = new Item({
  name: "Be productive"
});

const item2 = new Item ({
  name: "Hit the + button to add an item"
});

const item3 = new Item({
  name: "Click the Checkbox to delete an item"
});

//default Items array
const defaultItems = [item1, item2, item3];


/*default home route, which puts in the default items if there arent any.
This avoids creating defaultItems every time server starts*/

app.get("/", function(req, res) {
let day = date();
  Item.find({}, function(err, foundItems){
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function(err){
        if(err) {
          console.log(err);
        } else {
          console.log("successfully saved default items");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", {listTitle: day, newListItems: foundItems});
    }
  });

});

//first POST route, which puts newItems into the list.

app.post("/", (req, res) => {

  const itemName = req.body.newItem;

  const item = new Item({
    name: itemName
  });

  item.save();
  res.redirect("/");



});

//Delete Post Route, which will delete items from the database
//if the checkbox is marked, see list.ejs file

app.post("/delete", function(req,res){
  const checkedItemId = req.body.checkbox;
  Item.findByIdAndDelete(checkedItemId, function(err){
    if (!err) {
      console.log('successfully deleted checked item');}
  });
  res.redirect("/");
});



//Will add this route later on. As a separate DB.
// app.get("/work", (req, res) => {
//
//   /* same as the other app.get but it renders a work list, which features a different
//   array, which is empty.
//   This shows the use of EJS templating, ie, the daily todo list, and the work todolist are rendered from the same
//   ejs file, which is list.ejs, but we change the arguments passed on to the list.ejs template via the listTitle and the
//   array after it.
//
//   So that gives the result of two similar pages, which use the template, but are different in content.,
//
//   You can access it by going to the directory /work , thats the route.
//   */
//
//   res.render("list", {listTitle: "Work List", newListItems: workItems});
// } );

//Just testing another route, this time the file is blank,
app.get("/about", (req, res) => {
res.render("about");
});



app.listen(process.env.PORT || 3000, () => {
  console.log("Server Started on port 3000");
});
