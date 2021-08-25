const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const User = require('./user');
const Board = require('./board');

const Userboards = sequelize.define('userboard', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  owner: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  }
},
{
  timestamps: false,
  createdAt: false,
  updatedAt: false,
});

User.belongsToMany(Board, {
  through: Userboards
});
Board.belongsToMany(User, {
  through: Userboards
});

module.exports = Userboards;
