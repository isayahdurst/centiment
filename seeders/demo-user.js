'use strict';

const { User } = require('../models');

/** @type {import('sequelize-cli').Migration} */

module.exports = {
    async up(queryInterface, Sequelize) {
        /**
         * Add seed commands here.
         *
         * Example:
         * await queryInterface.bulkInsert('People', [{
         *   name: 'John Doe',
         *   isBetaMember: false
         * }], {});
         */

        await User.create({
            firstName: 'FirstName',
            lastName: 'LastName',
            username: 'firstname.lastname',
            email: 'test@centiment.com',
            bio: "I am a fake account. But that's okay, check me out anyway!",
            avatar: 
            password: 'test',
        });
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
    },
};
