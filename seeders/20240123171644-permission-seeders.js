"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   value: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert(
      "permissions",
      [
        {
          value: "create",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          value: "edit",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          value: "view",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          value: "delete",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("permissions", null, {});
  },
};
