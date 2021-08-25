const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Board = sequelize.define('board', {
  boardName: {
    allowNull: false,
    unique: false,
    type: DataTypes.STRING,
    validate: {
      notNull: {
        args: true,
        msg: 'Board name is missing',
      },
      notEmpty: {
        args: true,
        msg: 'Board name is required',
      },
    },
  }
});

module.exports = Board;
