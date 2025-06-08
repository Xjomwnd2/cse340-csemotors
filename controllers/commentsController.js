const commentModel = require("../models/commentsModel");

async function postComment(req, res, next) {
  try {
    const { inv_id, commenter_name, comment_text } = req.body;
    if (!inv_id || !commenter_name || !comment_text) {
      req.flash("error", "All fields are required.");
      return res.redirect("/inv/detail/" + inv_id);
    }

    await commentModel.addComment(inv_id, commenter_name, comment_text);
    res.redirect("/inv/detail/" + inv_id);
  } catch (err) {
    next(err);
  }
}

module.exports = { postComment };
