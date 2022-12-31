const { Router } = require('express');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const upload = multer({ dest: './public/data/uploads/' });
const fs = require('fs');
const auth = require('../../middleware/auth');

const { User } = require('./../../models');

const usersRouter = new Router();

usersRouter.put('/', auth, async (req, res) => {
    const user = req.user.get({ plain: true });
    const { firstName, lastName, username, bio, email, password } = req.body;

    await User.update(
        {
            first_name: firstName || user.first_name,
            last_name: lastName || user.last_name,
            username: username || user.username,
            bio: bio || user.bio,
            email: email || user.email,
            password: password || user.password,
        },
        { where: { id: user.id } }
    );

    console.log(user);
    res.end();
});

usersRouter.post('/login', async (req, res) => {
    const { username, password } = req.body;

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

usersRouter.post('/register', upload.single('avatar'), async (req, res) => {
    const { first_name, last_name, username, email, password } = req.body;
    console.log(req.file, req.body);

    const user = await User.findOne({
        where: {
            username,
        },
    });

    if (user) {
        res.status(409).end('User already exists');
        return;
    }
    const pathToAvatar = req.file.destination.concat(req.file.filename);
    const image = await fs.readFileSync(pathToAvatar);

    try {
        const user = await User.create({
            first_name,
            last_name,
            username,
            email,
            password,
            avatar: image,
        });
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

    if (!user) {
        res.json({ usernameAvailable: true });
    } else {
        res.json({ usernameAvailable: false });
    }
});

module.exports = usersRouter;
