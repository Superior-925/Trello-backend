const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const User = sequelize.define('user', {
  email: {
    allowNull: false,
    unique: true,
    type: DataTypes.STRING,
    validate: {
      notNull: {
        args: true,
        msg: 'Email is missing',
      },
      notEmpty: {
        args: true,
        msg: 'Email is required',
      },
    },
  },
  hash: {
    allowNull: true,
    type: DataTypes.STRING,
  },
  salt: {
    allowNull: true,
    type: DataTypes.STRING,
  },
  provider: {
    allowNull: true,
    type: DataTypes.STRING,
  },
});

module.exports = User;
