const express = require("express");
const router = express.Router();
const commentsController = require("../controllers/commentController");

router.post("/add/:invId", commentsController.postComment);


module.exports = router;
