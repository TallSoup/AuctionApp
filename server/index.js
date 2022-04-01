//jshint esversion:6
//https://www.freecodecamp.org/news/how-to-create-a-react-app-with-a-node-backend-the-complete-guide/
require("dotenv").config();
const path = require("path");
const express = require("express");
// import bodyParser from "body-parser";
// const bodyParser = require("body-parser");
const mongoose = require("mongoose");
// import mongoose from "mongoose";
// import "dotenv/config";
const PORT = process.env.PORT || 3001;
const app = express();

// import { v4 as uuid } from "uuid";
const { v4: uuid } = require("uuid");
// const bodyParser = require("body-parser");
const exp = require("constants");

// app.use(
//   bodyParser.urlencoded({
//     extended: true,
//   })
// );

// need this to parse the json with the req
app.use(express.json());
app.use(express.text());

const pass = process.env.DBPASSWORD;

const uri =
  "mongodb+srv://user1:" +
  pass +
  "@tallsoup.428jc.mongodb.net/AuctionDB?retryWrites=true&w=majority";

//connect to Mongo
mongoose
  .connect(uri)
  .then(() => console.log("Now connected to MongoDB!"))
  .catch((err) => console.error("Something went wrong", err));

//Schema
const itemSchema = new mongoose.Schema({
  key: String,
  id: String,
  title: String,
  bids: Number,
  price: Number, //will be stored in cents
  highBidder: String,
  seller: String,
  index: Number,
  img: String,
});

//Model
const Item = mongoose.model("Item", itemSchema);

const createItem = () => {
  //creating unique keys for items
  const newKey = uuid();
  const item = new Item({
    key: newKey,
    id: newKey,
    title: "Sample Item",
    bids: 0,
    price: 0,
    highBidder: "Jack",
    seller: "Andrew",
    index: 4, //fix
    img: "https://picsum.photos/400/300",
  });
  return item;
};

const sendItem = () => {
  let item = createItem();
  item.save();
  console.log(item);
  // try {
  //   res.redirect("/");
  // } catch (error) {
  //   console.log(error);
  // }
};

// sendItem();

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, "../client/build")));

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.post("/add", (req, res) => {
  const item = new Item(req.body);
  console.log(item);
  item.save();
});

app.post("/delete", (req, res) => {
  const itemToDeleteID = req.body;
  console.log(itemToDeleteID);
  Item.findOneAndDelete({ id: itemToDeleteID }, (err, deletedItem) => {
    if (!err) {
      console.log("deleted: ", deletedItem);
    } else {
      console.log("Error: ", err);
    }
  });
});

app.post("/bid", (req, res) => {
  let { id, bids, price } = req.body;
  // console.log(bids);
  Item.findOneAndUpdate(
    { id: id },
    { bids: bids, price: price },
    (err, foundItem) => {
      if (!err) {
        console.log("Updated: ", foundItem.title);
        //need to send a response else the fetch hangs up
        res.status(200).json({ success: true });
      } else {
        console.log("Error: ", err);
      }
    }
  );
});

app.get("/all", (req, res) => {
  Item.find({}, (err, foundItems) => {
    if (!err) {
      // console.log(foundItems);
      res.send(foundItems);
    } else {
      console.log(err);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
