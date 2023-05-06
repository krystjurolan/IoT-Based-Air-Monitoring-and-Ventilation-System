const db = require('../models'); // assuming your models are defined in a ./models folder

// const deleteOldData = async () => {
//   try {
//     const twoMonthsAgo = new Date();
//     twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2); // set the date to 2 months ago
//     const query = `DELETE FROM data WHERE createdAt < '${twoMonthsAgo.toISOString()}'`;
//     await db.sequelize.query(query);
//     console.log('Old data deleted successfully');
//   } catch (error) {
//     console.error('Error deleting old data:', error);
//   }
// };


const deleteOldData = async () => {
    try {
      const twoHoursAgo = new Date(Date.now() - 3600 * 1000); // set the date to 1 hour ago
      await db.data.destroy({ where: { created_at: { [db.Sequelize.Op.lt]: twoHoursAgo } } });
      console.log('Old data deleted successfully');
    } catch (error) {
      console.error('Error deleting old data:', error);
    }
  };

// deleteOldData();

module.exports = [deleteOldData];