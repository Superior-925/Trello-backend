const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const User = require('./user');
const Task = require('./task');

const Taskexecutor = sequelize.define('taskexecutor', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  executor: {
    allowNull: false,
    unique: false,
    type: DataTypes.BOOLEAN,
  },
},
{
  timestamps: false,
  createdAt: false,
  updatedAt: false,
});

User.belongsToMany(Task, {
  through: Taskexecutor
});
Task.belongsToMany(User, {
  through: Taskexecutor
});

module.exports = Taskexecutor;
