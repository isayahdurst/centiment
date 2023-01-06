/*const { Router } = require('express');
const auth = require('../../middleware/auth');
const { Post, User, Comment, Topic} = require('./../../models');
const Shares = require('../../models/Shares');
const { Sequelize, Op } = require('sequelize');

const commentRouter = new Router();

// create a new topic
commentRouter.post("/:topicId/", auth, async (req, res) => {
  const { content } = req.body;
  console.log(topic_name, description, price);
  try {
    const newComment = await Comment.create({
        content,
        up_vote: 0,
        post_id: req.params.post_id,
        user_id: req.user.id,
        date_created
    });
    res.status(200).json({
      id: newComment.id,
    });
  } catch (err) {
    res.status(400).json(err);
  }
});



















// add a post
topicRouter.post('/:id', auth, async (req, res) => {
  const { post_name, contents } = req.body
  const { id } = req.params;

  try {
    const newPost = await Post.create({
      post_name,
      contents,
      topic_id: id
      });
      res.status(200).json({
        id: newPost.id,
      });
      } catch (err) {
      res.status(400).json(err);
  }
});


// edit a topic
topicRouter.put('/edit/:id', auth, async (req, res) => {
    const { name, description, price } = req.body;
    try {
        const topic = await Topic.update(
            {
                name,
                description,
                price,
            },
            {
                where: {
                    id: req.params.id,
                },
            }
        );
        res.status(200).json(topic);
    } catch (err) {
        res.status(500).json(err);
    }
});
// delete a topic
topicRouter.delete('/:id', auth, async (req, res) => {
    try {
        const topic = await Topic.destroy({
            where: {
                id: req.params.id,
            },
        });
        if (!topic) {
            res.status(404).json({ message: 'No topic found with this id!' });
            return;
        }
        res.status(200).json(topic);
    } catch (err) {
        res.status(500).json(err);

    }
});


topicRouter.get("/search", auth, async (req, res) => {
  try {
    // get the search query from the request query string
    const searchQuery = req.query.q;

    // use Sequelize to search for topics matching the search criteria
    let topics = await Topic.findAll({
      where: {
        [Op.or]: [
          {
            topic_name: {
              [Op.like]: "%"+searchQuery+"%",
            },
          },
          {
            description: {
              [Op.like]: "%"+searchQuery+"%",
            },
          }
        ]
      },
    });
    if (!topics) {
      res.status(404).json({ message: "No topic found" });
      return;
    }
    res.status(200).json(topics);
  } catch (error) {
    console.log(error);
  }
});


module.exports = commentRouter;
*/