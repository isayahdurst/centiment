const { Router } = require('express');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const upload = multer({ dest: './public/data/uploads/' });
const fs = require('fs');
const auth = require('../../middleware/auth');
const { Op } = require('sequelize');

const { User } = require('./../../models');

const usersRouter = new Router();

usersRouter.put('/', auth, upload.single('avatar'), async (req, res) => {
    const user = req.user.get({ plain: true });
    const { firstName, lastName, username, bio, email, password } = req.body;
    let userDetails = {
        first_name: firstName || user.first_name,
        last_name: lastName || user.last_name,
        username: username || user.username,
        bio: bio || user.bio,
        email: email || user.email,
        password: password || user.password,
    };
    if (req.file !== undefined) {
        const pathToAvatar = req.file.destination.concat(req.file.filename);
        avatar = await fs.readFileSync(pathToAvatar);
        userDetails.avatar = avatar;
    }

    try {
        await User.update(userDetails, {
            where: {
                id: user.id,
            },
            individualHooks: true,
        });
    } catch (error) {
        console.log(error);
    }

    res.end();
});

usersRouter.get('/logout', async (req, res) => {
    console.log(req.cookies);
    res.status(200)
        .clearCookie('logintoken', {
            path: '/',
            domain: 'localhost',
            expires: new Date(1),
        })
        .redirect('/login');
});

usersRouter.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({
        where: {
            username: req.body.username,
        },
    });

    console.log(user);

    if (!user) {
        res.status(400).json({ message: 'Bad Request, User Not Found' });
        return;
    }

    const correctPassword = user.checkPassword(password);
    if (!correctPassword) {
        res.status(401).json({ message: 'Not Authorized, Bad Password' });
        return;
    }

    const token = jwt.sign({ id: username }, process.env.JWT_KEY);
    res.cookie('logintoken', token, { httpOnly: true });
    res.status(200).json({ message: `User ${username} logged in succesfully` });
});

usersRouter.post('/register', upload.single('avatar'), async (req, res) => {
    const { first_name, last_name, username, email, password } = req.body;

    const user = await User.findOne({
        where: {
            [Op.or]: [{ username: username }, { email: email }],
        },
    });

    if (user) {
        res.status(409).json({
            message:
                'A user with this username or email already exists. Try logging in, instead.',
        });
        return;
    }

    try {
        const user = await User.create({
            first_name,
            last_name,
            username,
            email,
            password,
            avatar: null,
        });
        const token = jwt.sign({ id: username }, process.env.JWT_KEY);
        res.cookie('logintoken', token, { httpOnly: true });
        res.status(200).json({ id: user.id });
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

usersRouter.get('/check/:username', async (req, res) => {
    const user = await User.findOne({
        where: {
            username: req.params.username,
        },
    });

    /* user.increaseBalance(100); */

    if (!user) {
        res.json({ usernameAvailable: true });
    } else {
        res.json({ usernameAvailable: false });
    }
});

module.exports = usersRouter;
