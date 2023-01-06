const { Router } = require("express");
const auth = require("../../middleware/auth");
const { Topic, Post } = require("./../../models");
const { Op } = require("sequelize");

const topicRouter = new Router();

// create a new topic
topicRouter.post("/", auth, async (req, res) => {
  const { topic_name, description, price } = req.body;
  console.log(topic_name, description, price);
  try {
    const newTopic = await Topic.create({
      topic_name,
      description,
      price,
      user_id: req.user.id,
    });
    res.status(200).json({
      id: newTopic.id,
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

// edit a topic
topicRouter.put("/edit/:id", auth, async (req, res) => {
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
topicRouter.delete("/:id", auth, async (req, res) => {
  try {
    const topic = await Topic.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (!topic) {
      res.status(404).json({ message: "No topic found with this id!" });
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

module.exports = topicRouter;
