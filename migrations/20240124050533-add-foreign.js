"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addConstraint("user_role", {
      fields: ["user_id"],
      type: "foreign key",
      name: "user_role_user_id_foreign",
      references: {
        table: "users",
        field: "id",
      },
    });

    await queryInterface.addConstraint("user_role", {
      fields: ["role_id"],
      type: "foreign key",
      name: "user_role_role_id_foreign",
      references: {
        table: "roles",
        field: "id",
      },
    });

    await queryInterface.addConstraint("role_permission", {
      fields: ["role_id"],
      type: "foreign key",
      name: "role_permission_role_id_foreign",
      references: {
        table: "roles",
        field: "id",
      },
    });

    await queryInterface.addConstraint("role_permission", {
      fields: ["permission_id"],
      type: "foreign key",
      name: "role_permission_permission_id_foreign",
      references: {
        table: "permissions",
        field: "id",
      },
    });

    await queryInterface.addConstraint("users_permissions", {
      fields: ["user_id"],
      type: "foreign key",
      name: "users_permissions_user_id_foreign",
      references: {
        table: "users",
        field: "id",
      },
    });

    await queryInterface.addConstraint("users_permissions", {
      fields: ["permission_id"],
      type: "foreign key",
      name: "users_permissions_permission_id_foreign",
      references: {
        table: "permissions",
        field: "id",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
