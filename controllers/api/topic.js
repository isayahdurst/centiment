const { Router } = require('express');
const auth = require('../../middleware/auth');
const { Topic } = require('./../../models');
const { Post, User } = require('./../../models');
const Shares = require('../../models/Shares');
const { Sequelize, Op } = require('sequelize');

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

// Creates shares from inital offering.
topicRouter.post('/buyIPO', auth, async (req, res) => {
    const { topic_id, quantity } = req.body;
    const topic = await Topic.findByPk(topic_id);
    const user = await User.findByPk(req.user.id);
    console.log(user.id);

    try {
        const shares = await Shares.findOne({
            where: {
                [Op.and]: [
                    {
                        topic_id: topic.id,
                    },
                    {
                        user_id: user.id,
                    },
                ],
            },
        });

        if (!shares)
            throw new Error('No existing purchase found, creating new shares');

        await shares.update({
            amount: shares.amount + Number(quantity),
        });

        console.log(shares);

        await user.decreaseBalance(quantity * topic.price);

        /* const shares = await Shares.upsert({
            topic_id: topic_id,
            user_id: user.id,
            amount: Sequelize.literal('amount '),
            ipo_shares: true,
        }); */

        res.json(shares);
    } catch (error) {
        if (
            error.message === 'No existing purchase found, creating new shares'
        ) {
            const shares = await Shares.create({
                topic_id: topic_id,
                user_id: user.id,
                amount: quantity,
                ipo_shares: true,
            });
            console.log(shares);
        }
        console.log(error);
        res.json(error.message);
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

    // use Sequelize to search for topics matching the search criteria by title and descrition
    // return results ordered by update_at and limit 20 records
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
    order: [['updated_at','DESC']],
    limit: 20,
    },
    );
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
