// 'use strict';
module.exports = (sequelize, DataTypes) => {

    const Data = sequelize.define('Data', {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        RoomId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'room_id',
          references: {        
            model: 'rooms',
            key: 'id'
          }
        },
        device_id: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        temperature: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
        humidity: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
        air_quality: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
      }, 
      { 
        timestamps: true,
        createdAt: true, 
        updatedAt: false, // don't add updatedAt attribute
      }
      );

      Data.associate = function(models) {
        Data.belongsTo(models.Rooms, {foreignKey: 'room_id', as: 'room'})
      };
      
      Data.sync();
      return Data;

      // Create the data table if it doesn't exist
      

}