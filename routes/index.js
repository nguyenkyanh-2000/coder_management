var express = require("express");
var router = express.Router();
const { sendResponse, AppError } = require("../helpers/utils.js");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.status(200).send("Hello!");
});

module.exports = router;
