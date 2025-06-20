const express = require("express");
const router = express.Router();
const commentsController = require("../controllers/commentsController");

router.post("/add", commentsController.postComment);

router.router.post("/add/:invId", commentsController.postComment); // ✅ Correct


module.exports = router;
