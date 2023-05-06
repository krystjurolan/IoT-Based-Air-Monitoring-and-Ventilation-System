'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    async (queryInterface, Sequelize) => {
      await queryInterface.renameColumn('Data', 'RoomId', 'room_id');
    }
  },

  async down (queryInterface, Sequelize) {
    // await queryInterface.renameColumn('Data', 'room_id', 'RoomId');
  }
};
