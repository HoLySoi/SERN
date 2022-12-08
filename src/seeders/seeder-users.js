"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Users", [
      {
        email: "holysoi.toan@gmail.com",
        password: "123456",
        firstName: "Ho",
        lastName: "Toan",
        address: "VietNam",
        gender: 1,
        typeRole: "ROLE",
        keyRole: "R1",

        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
