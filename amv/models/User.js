const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {

  const User = sequelize.define("Users", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  });

  // // Add hook to hash password before creating a user
  // User.beforeCreate(async (user, options) => {
  //   const hashedPassword = await bcrypt.hash(user.password, 10);
  //   console.log("-------------- Password in the MODEL: " + user.password);
  //   console.log("-------------- Password in the MODEL HASHED: " + hashedPassword);
  //   user.password = hashedPassword;
  // });

  // // Add hook to hash password before updating a user
  // User.beforeUpdate(async (user, options) => {
  //   const hashedPassword = await bcrypt.hash(user.password, 10);
  //   console.log("-------------- Password in the MODEL: " + user.password);
  //   console.log("-------------- Password in the MODEL HASHED: " + hashedPassword);
  //   user.password = hashedPassword;
  // });

  return User;
}
