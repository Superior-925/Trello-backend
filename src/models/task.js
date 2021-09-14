const { DataTypes } = require('sequelize');
const sequelize = require('../database');
//const Board = require('./board');

const Task = sequelize.define('task', {
  //todo: move columns to a separate table
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

// Board.hasMany(Task, { onDelete: 'cascade' });
// Task.belongsTo(Board);

module.exports = Task;
