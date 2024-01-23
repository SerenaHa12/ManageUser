"use strict";

const bcrypt = require("bcrypt");
const { faker } = require("@faker-js/faker");

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
    const data = [];

    const salt = bcrypt.genSaltSync(10);
    data.push({
      name: "Hà Chi",
      email: "dhchsgs12@gmail.com",
      password: bcrypt.hashSync("123456", salt),
      status: true,
      created_at: new Date(),
      updated_at: new Date(),
    });

    await queryInterface.bulkInsert("users", data, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("users", null, {});
  },
};
