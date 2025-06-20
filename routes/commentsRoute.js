const express = require("express");
const router = express.Router();
const commentsController = require("../controllers/commentsController");

router.post("/add/:invId", commentController.postComment);

module.exports = router;
