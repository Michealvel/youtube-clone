const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema({
  videoId: { type: String, required: true, minlength: 2, maxlength: 255 },
  comment: { type: String, required: true },
  like: { type: Boolean, required: true },
  parentId: { type: String },
  dateModified: { type: Date, default: Date.now },
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = { Comment };

