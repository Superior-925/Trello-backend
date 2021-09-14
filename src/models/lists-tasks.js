const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const Task = require('./task');
const Board = require('./board');

const List = sequelize.define('lists', {
  listName: {
    allowNull: false,
    unique: false,
    type: DataTypes.STRING,
    validate: {
      notNull: {
        args: true,
        msg: 'List name is missing',
      },
      notEmpty: {
        args: true,
        msg: 'List name is required',
      },
    },
  },
});

Board.hasMany(List, { onDelete: 'cascade' });
List.belongsTo(Board);

List.hasMany(Task, { onDelete: 'cascade' });
Task.belongsTo(List);

module.exports = List;
