const { Comment } = require(`../models/comment`);
const express = require("express");
const router = express.Router();


router.get("/:id", async (req, res) => {
  try {
    console.log("id", req.params.id);
    const comments = await Comment.find({ videoId: req.params.id, parentId: '' });
    const comments_json = JSON.parse(JSON.stringify(comments));
    for (var i = 0; i < comments_json.length; i++) {
      const item = comments_json[i];
      // console.log("Item", item);
      const replies = await Comment.find({ videoId: req.params.id, parentId: item._id });
      // console.log("replies", replies);

      comments_json[i].replies = replies;
    }

    // console.log("comments", comments_json);

    return res.send(comments_json);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

router.post("/", async (req, res) => {
  try {
    const comment = new Comment({
      videoId: req.body.videoId,
      comment: req.body.comment,
      like: false,
      parentId: req.body.parentId,
      price: req.body.price,
    });

    await comment.save();

    return res.send(comment);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

router.put("/:id", async (req, res) => {
  try {
    //Need to validate body before continuing
    console.log("put_id", req.params.id);
    console.log("body", req.body);

    const query = { _id: req.params.id };

    await Comment.findOneAndUpdate(query, req.body, { upsert: true });

    return res.send({ result: 200 });
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});



module.exports = router;
