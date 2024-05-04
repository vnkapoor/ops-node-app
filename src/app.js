const express = require("express");
const { createServer } = require("http");
const bodyParser = require("body-parser");
const path = require("path");


const app = express();

app.use(express.static(path.join(__dirname, '../public')));


//Middlewares
const errorHandler = require("./middlewares/errorhandler.middleware.js");


// Parse JSON bodies
app.use(bodyParser.json());
// Parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

const httpServer = createServer(app);

//App routes
const userRouter = require("./routes/user.routes.js");

//Define authenticated routes
app.use("/api", userRouter);

//Define the open routes
app.use("/api/auth", userRouter);

module.exports = { httpServer };
