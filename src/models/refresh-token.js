const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const User = require('./user');

const RefreshToken = sequelize.define('refreshtoken', {
  token: {
    allowNull: false,
    unique: false,
    type: DataTypes.STRING(4096),
    validate: {
      notNull: {
        args: true,
        msg: 'Token is missing',
      },
      notEmpty: {
        args: true,
        msg: 'Token is required',
      },
    },
  },
});

User.hasMany(RefreshToken, { onDelete: 'cascade' });

module.exports = RefreshToken;
