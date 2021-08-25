const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const Board = require('./board');

const Task = sequelize.define('task', {
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
  taskTitle: {
    allowNull: false,
    unique: false,
    type: DataTypes.STRING,
    validate: {
      notNull: {
        args: true,
        msg: 'Task title is missing',
      },
      notEmpty: {
        args: true,
        msg: 'Task title is required',
      },
    },
  },
  taskText: {
    allowNull: true,
    unique: false,
    type: DataTypes.STRING,
  },
  archived: {
    allowNull: true,
    unique: false,
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  order: {
    allowNull: true,
    unique: false,
    type: DataTypes.INTEGER,
  },
});

Board.hasMany(Task, { onDelete: "cascade" });

module.exports = Task;
