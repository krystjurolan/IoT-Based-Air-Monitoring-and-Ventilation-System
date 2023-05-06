// 'use strict';

module.exports = (sequelize, DataTypes) => {

    const Rooms = sequelize.define('Rooms', {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        device_id: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        BuildingId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'building_id',
          references: {        
            model: 'buildings',
            key: 'id' 
          }
        },
        room_name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        room_desc: {
          type: DataTypes.TEXT,
        },
        // createdAt: {
        //   type: DataTypes.DATE,
        //   field: 'created_at' // specify the actual column name in the database
        // },
      },
      // {
      //   underscored: true // add this option
      // }
      );
      
      // Rooms.belongsToMany(Buildings, { foreignKey: 'building_id' });

      Rooms.associate = function(models) {
        Rooms.hasMany(models.Data, {as: 'data'})
      };

      Rooms.associate = function(models) {
        Rooms.belongsTo(models.Buildings, {foreignKey: 'building_id', as: 'building'})
      };

      


      Rooms.sync();
    return Rooms;
}