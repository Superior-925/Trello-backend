const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const Board = require('./board');

const TaskAction = sequelize.define('taskaction', {
  taskId: {
    allowNull: false,
    unique: false,
    type: DataTypes.INTEGER,
    validate: {
      notNull: {
        args: true,
        msg: 'Task id is missing',
      },
      notEmpty: {
        args: true,
        msg: 'Task id is required',
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
  action: {
    allowNull: true,
    unique: false,
    type: DataTypes.STRING,
  },
});

Board.hasMany(TaskAction, { onDelete: "cascade" });

module.exports = TaskAction;
