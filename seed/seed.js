const { User } = require('../models');

const createUsers = async function () {
    return await User.bulkCreate([
        {
            first_name: 'Ftest',
            last_name: 'Ltest',
            username: 'testUser',
            email: 'email1',
            password: 'test',
            bio: 'Lorem ipsum asdfasdfas a sdfasdf asdfasdfasdsad  sdfasdfas a sdfasdf asdf asfasd fa.',
        },
        {
            first_name: 'Ftest',
            last_name: 'Ltest',
            username: 'testUser1',
            email: 'email',
            password: 'test',
            bio: 'Lorem ipsum asdfasdfas a sdfasdf asdfasdfasdsad  sdfasdfas a sdfasdf asdf asfasd fa.',
        },
        {
            first_name: 'Ftest',
            last_name: 'Ltest',
            username: 'testUser2',
            email: 'email2',
            password: 'test',
            bio: 'Lorem ipsum asdfasdfas a sdfasdf asdfasdfasdsad  sdfasdfas a sdfasdf asdf asfasd fa.',
        },
        {
            first_name: 'Ftest',
            last_name: 'Ltest',
            username: 'testUser3',
            email: 'email3',
            password: 'test',
            bio: 'Lorem ipsum asdfasdfas a sdfasdf asdfasdfasdsad  sdfasdfas a sdfasdf asdf asfasd fa.',
        },
        {
            first_name: 'Ftest',
            last_name: 'Ltest',
            username: 'testUser4',
            email: 'email4',
            password: 'test',
            bio: 'Lorem ipsum asdfasdfas a sdfasdf asdfasdfasdsad  sdfasdfas a sdfasdf asdf asfasd fa.',
        },
    ]);
};

module.exports = createUsers;
