const express = require("express");
const router = express.Router();
const commentsController = require("../controllers/commentsController");

router.post("/add/:invId", commentsController.postComment);
router.post("/comments/add", commentController.addComment);


module.exports = router;
