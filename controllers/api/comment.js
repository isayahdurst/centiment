const { Router } = require('express');
const auth = require('../../middleware/auth');
const { Post, User, Comment, Topic} = require('./../../models');
const Shares = require('../../models/Shares');
const { Sequelize, Op } = require('sequelize');

const commentRouter = new Router();




// Post a new Comment to a given Post_id
commentRouter.post("/:post_id", auth, async (req, res) => {
    const { content } = req.body;
    const { post_id } = req.params;
    const user = await User.findByPk(req.user.id);
    try {
            const newComment = await Comment.create({
                content,
                post_id: post_id,
                user_id: user.id,
            });

            res.status(200).json({
                id: newComment.id,
            });
    } catch (err) {
            res.status(400).json(err);
    };
});


// Get all comments for a Post
commentRouter.get("/post/:post_id", auth, async (req, res) => {
    try {
      // get the search query from the request query string
      const { post_id } = req.params;
  
    // use Sequelize to search for the latest 10 comments of a post
        let comments = await Comment.findAll({
            where: {
                post_id: post_id,
            },
            include: [User, Post],
            order: [
                ["id", "ASC"]
            ],
            offset: 10,
            limit: 10,
        });

        if (!comments) {
            res.status(404).json({ message: "No comment found" });
            return;
        }

        res.status(200).json(comments);

    } catch (error) {
        console.log(error);
    }
});


// Get last 10 comments for a Post
commentRouter.get("/post/next5/:num_comments_retrieved/:post_id", auth, async (req, res) => {
    try {
        // get the search query from the request query string
        const { post_id, num_comments_retrieved } = req.params;

        const parsed_num_comments_retrieved = parseInt(num_comments_retrieved);

        if (isNaN(parsed_num_comments_retrieved)){
            throw new Error("num_comments_retrieved is not an integer.")
        };

  
        // use Sequelize to search for the latest 10 comments of a post
        let comments = await Comment.findAll({
            where: {
                post_id: post_id,
            },
            include: [User, Post],
            order: [
                ["id", "ASC"]
            ],
            offset: parsed_num_comments_retrieved,
            limit: 5,
        });

        if (!comments) {
            res.status(404).json({ message: "No comment found" });
            return;
        }

        res.status(200).json(comments);

    } catch (error) {
        console.log(error);
    }
});

// Get one comment by ID
commentRouter.get("/:id", auth, async (req, res) => {
    try {
        const { id } = req.params;
        let comment = await Comment.findByPk(id, {
            include: ["user", "post"],
        });

        if (!comment) {
            res.status(404).json({ message: "No comment found with that comment ID" });
            return;
        }

        res.status(200).json(comment);

        } catch (error) {
            console.log(error);
        }
});


// Delete a Comment
commentRouter.delete('/:id', auth, async (req, res) => {
    try {
        const comment = await Comment.destroy({
            where: {
                id: req.params.id,
            },
        });
        if (!comment) {
            res.status(404).json({ message: 'No comment found with this id!' });
            return;
        }
        res.status(200).json(comment);
    } catch (err) {
        res.status(500).json(err);

    }
});





//---------------------------------------------------------------------------------
// No Auth versions

/*

commentRouter.post("/:post_id", async (req, res) => {
    const { content } = req.body;
    const { post_id } = req.params;
    try {
            const newComment = await Comment.create({
                content,
                post_id: post_id,
                user_id: 1,
            });

            res.status(200).json({
                id: newComment.id,
            });
    } catch (err) {
            res.status(400).json(err);
    };
});


// Get last 10 comments for a Post
commentRouter.get("/post/:post_id", async (req, res) => {
    try {
      // get the search query from the request query string
      const { post_id } = req.params;
  
      // use Sequelize to search for all comments for a given :topicId
      let comments = await Comment.findAll({
        where: {
            post_id: post_id
            },
        },
      );

      if (!comments) {
        res.status(404).json({ message: "No comment found" });
        return;
      }

      res.status(200).json(comments);

    } catch (error) {
        console.log(error);
    }
});


// Get all comments for a Post
commentRouter.get("/post/next10/:num_comments_retrieved/:post_id", async (req, res) => {
    try {
        // get the search query from the request query string
        const { post_id, num_comments_retrieved } = req.params;

        const parsed_num_comments_retrieved = parseInt(num_comments_retrieved);

        if (isNaN(parsed_num_comments_retrieved)){
            throw new Error("num_comments_retrieved is not an integer.")
        };

  
        // use Sequelize to search for the latest 10 comments of a post
        let comments = await Comment.findAll({
            where: {
                post_id: post_id,
            },
            order: [
                ["id", "DESC"]
            ],
            offset: parsed_num_comments_retrieved,
            limit: 10,
        });

        if (!comments) {
            res.status(404).json({ message: "No comment found" });
            return;
        }

        res.status(200).json(comments);

    } catch (error) {
        console.log(error);
    }
});


// Get one comment by ID
commentRouter.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        let comment = await Comment.findByPk(id);

        if (!comment) {
            res.status(404).json({ message: "No comment found with that comment ID" });
            return;
        }

        res.status(200).json(comment);

        } catch (error) {
            console.log(error);
        }
});


// Delete a Comment
commentRouter.delete('/:id', async (req, res) => {
    try {
        const comment = await Comment.destroy({
            where: {
                id: req.params.id,
            },
        });
        if (!comment) {
            res.status(404).json({ message: 'No comment found with this id!' });
            return;
        }
        res.status(200).json(comment);
    } catch (err) {
        res.status(500).json(err);

    }
});

*/

//------------------------------------------------------------------------





/*
// edit a comment
commentRouter.put('/edit/:id', auth, async (req, res) => {
    const { content } = req.body;
    try {
        const comment = await Comment.update(
            {
                content,
            },
            {
                where: {
                    id: req.params.id,
                },
            }
        );
        res.status(200).json(comment);
    } catch (err) {
        res.status(500).json(err);
    }
});

*/

module.exports = commentRouter;
