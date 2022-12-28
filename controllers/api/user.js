const { Router } = require('express');
const jwt = require('jsonwebtoken');

const { User } = require('./../../models');

const usersRouter = new Router();

usersRouter.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log(
        `validate user with username ${username} and password ${password}`
    );

    const user = await User.findOne({
        where: {
            username: req.body.username,
        },
    });

    if (!user) {
        res.status(401).json('User not found');
        return;
    }

    const correctPassword = user.checkPassword(password);
    if (!correctPassword) {
        res.status(401).json('Bad password');
        return;
    }

    const token = jwt.sign({ id: username }, process.env.JWT_KEY);
    res.cookie('logintoken', token, { httpOnly: true });
    res.status(200).json(`User ${username} logged in succesfully`);
});

usersRouter.post('/', async (req, res) => {
    const { first_name, last_name, username, email, password, avatar } =
        req.body;

    const user = await User.findOne({
        where: {
            username,
        },
    });

    if (user) {
        res.status(409).end('User already exists');
        return;
    }

    const newUserObject = await User.create({
        first_name,
        last_name,
        username,
        email,
        password,
        avatar,
    });

    res.status(200).json({
        id: newUserObject.id,
    });
});

usersRouter.get('/check/:username', async (req, res) => {
    const user = await User.findOne({
        where: {
            username: req.params.username,
        },
    });

    if (!user) {
        res.json({ usernameAvailable: true });
    } else {
        res.json({ usernameAvailable: false });
    }
});

module.exports = usersRouter;
