const express = require("express");
const router = express.Router();
const commentsController = require("../controllers/commentsController");

router.post("/add", commentsController.postComment);

module.exports = router;
