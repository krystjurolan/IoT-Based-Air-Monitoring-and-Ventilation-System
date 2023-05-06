// 'use strict';
module.exports = (sequelize, DataTypes) => {

    const Buildings = sequelize.define('Buildings', {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        building_name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        building_desc: {
          type: DataTypes.TEXT,
        },
      });

    //   Buildings.associate = function(models) {
    //     Buildings.hasOne(models.Rooms);
    //   };

    Buildings.associate = function(models) {
        Buildings.hasMany(models.Rooms, {as: 'room'})
      };

    Buildings.sync();
    return Buildings;
}