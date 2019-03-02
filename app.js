// jshint esversion:6

//express and body parser modules
const express = require("express");
const bodyParser = require("body-parser");

//lodash
const _ = require("lodash");

// 1st require mongoose
const mongoose = require('mongoose');
// To avoid
//(node:12872) DeprecationWarning: collection.findAndModify is deprecated. Use findOneAndUpdate, findOneAndReplace or findOneAndDelete instead.
mongoose.set('useFindAndModify', false);

//this requires the date.js module, which is just a function that gives today's date
const date = require(__dirname + "/date.js");


const app = express();

const day = date();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


/*MONGODB  ---- INTEGRATION*/

//connect to mongoDB database con atlas server
mongoose.connect("mongodb+srv://admin:algo1234@cluster0-ekehs.mongodb.net/todolistDB", {useNewUrlParser: true});
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


//list schema for custom route lists
const listSchema = new mongoose.Schema ({
  name: String,
  items: [itemSchema],

});
//mongoose model for custom route schemas
const List = mongoose.model("List", listSchema);



/*default home route, which puts in the default items if there arent any.
This avoids creating defaultItems every time server starts*/

app.get("/", function(req, res) {
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
      res.render("list", {listTitle: "Today", newListItems: foundItems, today:day});
    }
  });

});

app.get("/:customListName", (req,res) => {
  //this will generate a new list for each custom route we put.
const customListName = _.capitalize(req.params.customListName);
// if there is a list allready with the name, it wont create a new one with
// the following code
List.findOne({name:customListName}, (err, foundList) => {
  if (!err){
    if(!foundList){
      //creates a new list
      const list = new List({
        name: customListName,
        items: defaultItems
      });
      list.save();
      //must redirect to the new custom list if new one is created.
      res.redirect("/" + customListName);
    } else {
      res.render("list", {listTitle: foundList.name, newListItems: foundList.items, today:day});
    }
  }
});


});

//first POST route, which puts newItems into the list.

app.post("/", (req, res) => {

  const itemName = req.body.newItem;
  const listName = req.body.list;
  const item = new Item({
    name: itemName
  });

  if (listName === "Today") {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({name:listName}, (err, foundList) => {
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    });
  }



});

//Delete Post Route, which will delete items from the database
//if the checkbox is marked, see list.ejs file

app.post("/delete", function(req,res){
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today") {   Item.findByIdAndDelete(checkedItemId, function(err){
      if (!err) {
        console.log('at ' + ' " ' + __filename +  ' " ' + ' successfully deleted checked item');}
    });
    res.redirect("/");
  } else {
List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, (err, foundList) => {
  if (!err){
    res.redirect("/" + listName);
  }
} );
  }


});



app.listen(process.env.PORT || 3000, () => {
  console.log("Server Started on port 3000");
});
