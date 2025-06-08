const commentModel = require("../models/commentsModel");

async function postComment(req, res, next) {
  try {
    const { inv_id, commenter_name, comment_text } = req.body;

    // ✅ Basic input validation
    if (!inv_id || !commenter_name || !comment_text) {
      req.flash("error", "All fields are required.");
      return res.redirect(`/inv/detail/${inv_id}`);
    }

    // ✅ Optional extra validation
    if (commenter_name.length > 100) {
      req.flash("error", "Name must be under 100 characters.");
      return res.redirect(`/inv/detail/${inv_id}`);
    }

    if (comment_text.length < 3) {
      req.flash("error", "Comment is too short.");
      return res.redirect(`/inv/detail/${inv_id}`);
    }

    // ✅ Sanitize input (trim spaces)
    const cleanName = commenter_name.trim();
    const cleanText = comment_text.trim();

    // ✅ Insert comment using model
    await commentModel.addComment(inv_id, cleanName, cleanText);

    req.flash("notice", "Thank you! Your comment has been posted.");
    res.redirect(`/inv/detail/${inv_id}`);
  } catch (err) {
    console.error("Comment post failed:", err.message);
    req.flash("error", "Oops! Something went wrong submitting your comment.");
    res.redirect(`/inv/detail/${req.body.inv_id || ""}`);
  }
}

module.exports = { postComment };
