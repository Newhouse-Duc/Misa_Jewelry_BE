'use strict';

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
    await queryInterface.bulkInsert('User',
      [
        {
          email: 'JohnDoe@gmail.com',
          password: '123',
          username: 'test1',

        },
        {
          email: 'JohnDoe2@gmail.com',
          password: '123',
          username: 'test2',

        },
        {
          email: 'JohnDoe3@gmail.com',
          password: '123',
          username: 'test3',

        }
      ], {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
