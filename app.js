var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
require("dotenv").config();
const cors = require("cors");
const { sendResponse, AppError } = require("./helpers/utils.js");
const mongoose = require("mongoose");

var indexRouter = require("./routes/index");
var userRouter = require("./routes/user.api");
const taskRouter = require("./routes/task.api");
var app = express();

app.use(logger("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter, userRouter, taskRouter);

//error handling
app.use((req, res, next) => {
  const err = new AppError(404, "Not Found", "Bad Request");
  next(err);
});

app.use((err, req, res, next) => {
  console.log("ERROR", err);
  return sendResponse(
    res,
    err.statusCode ? err.statusCode : 500,
    false,
    null,
    { message: err.message },
    err.isOperational ? err.errorType : "Internal Server Error"
  );
});

//connect to db
mongoose
  .connect(process.env.MONGODB_URI, { dbName: "codermanagementDB" })
  .then(() => {
    console.log("Connected to DB!");
  })
  .catch((error) => console.log(error));

module.exports = app;
