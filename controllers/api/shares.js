const { Router } = require('express');
const auth = require('../../middleware/auth');
const { Post, User, Comment, Topic, Shares} = require('./../../models');
const { Sequelize, Op } = require('sequelize');

const sharesRouter = new Router();


// Get number of members holding shares for a topic_id
sharesRouter.get("/:topic_id", async (req, res) => {
    try {
      const { topic_id } = req.params;
      const parsedTopicId = parseInt(topic_id);
  
    // Count of number of users for a given topic_id
        let memberCount = await Shares.count({
            where: {
                topic_id: parsedTopicId,
            },
            distinct: true
        });

        if (!memberCount) {
            res.status(404).json({ message: "No shares found" });
            return;
        }

        res.status(200).json(memberCount);

    } catch (error) {
        console.log(error);
    }
});

module.exports = sharesRouter;