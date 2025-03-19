const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Chat = require("./models/chat.js");
const app = express();


/* Path setup */
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true })); // Enables URL-encoded body parsing.


/* Database connectivity setup */
main()
  .then(() => {
    console.log("Database connected.");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/LetChat");
}

/* All Routes */
// home route
app.get("/", (req, res) => {
  try {
    res.render("land.ejs")
    
  } catch (error) {
 
  }
 });

// /chats: To see all chats.
app.get("/chats",async (req, res) => {
  let chats = await Chat.find().sort({ created_at: -1 }); //To extract all chat data from database.
  res.render("index.ejs", { chats });
});



// new route
app.get("/chats/new",(req,res)=>{
res.render("new.ejs");
});




// POST /chats/new: To insert new chat data in DB.
app.post("/chats/new", async (req, res, next) => {
  let { from, to, msg } = req.body;
  let newChat = new Chat({
    from: from,
    to: to,
    message: msg,
    created_at: new Date(),
    updated_at: new Date(),
  });
newChat.save().then((res)=>console.log("chat is saved")).catch((err)=>console.log("chat not saved"))
  res.redirect("/chats")
});

// GET /chats/:id/edit - To render edit form.
app.get("/chats/:id/edit", async (req, res, next) => {
  let { id } = req.params;
  let chat = await Chat.findById(id);
  res.render("edit.ejs", { chat });
});

// PUT /chats/:id - To update new data in DB.
// app.put("/chats/:id", asyncWrap(async (req, res) => {
//   let { id } = req.params;
//   let { msg: newMessage } = req.body;
//   let updatedChat = await Chat.findByIdAndUpdate(
//     id,
//     { message: newMessage, updated_at: new Date() },
//     { runValidators: true, new: true },
//   );
//   console.log(updatedChat);
//   res.redirect("/chats");
// }));

// // DELETE /chats/:id - To delete chat from DB.
// app.delete(
//   "/chats/:id",
//   asyncWrap(async (req, res) => {
//     let { id } = req.params;
//     let deletedChat = await Chat.findByIdAndDelete(id);
//     console.log(deletedChat);
//     res.redirect("/chats");
//   }),
// );

// Utility function to handle asynchronous error more efficiently.
// function asyncWrap(asyncFunction) {
//   return function (req, res, next) {
//     asyncFunction(req, res, next).catch((error) => next(error));
//   }
// }

// Utility function: Use when error occurs to do some importnat tasks.
// const handleValidationError = (err) => {
//   console.log("This is validation error. Please follow rules.");
//   console.dir(err.message);
//   return err;
// }

// // Error handling middleware.
// app.use((err, req, res, next) => { // Error handler for specific error.
//   console.log(err.name);
//   if (err.name === "ValidationError") err = handleValidationError(err);
//   next(err);
// });

// app.use((err, req, res, next) => {
//   let { status = 500, message = "Some Error Occurred" } = err;
//   res.status(status).send(message);
// });

let allChats = [
  {
    from: "sarvesh",
    to: "Mahadev",
    message: "How can I become like you?",
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    from: "captain",
    to: "tony",
    message: "Hi, Tony",
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    from: "tony",
    to: "bruce",
    message: "Hi, Hulk",
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    from: "soap",
    to: "ghost",
    message: "lt, are you ugly?",
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    from: "makarov",
    to: "price",
    message: "It's not good captain, you will pay for this.",
    created_at: new Date(),
    updated_at: new Date(),
  },
];

Chat.insertMany(allChats);

/* Server setup */
app.listen(8080, () => {
  console.log("Server is running on localhost:8080");
});