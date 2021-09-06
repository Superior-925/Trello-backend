const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const Task = require('./task');

const TaskAction = sequelize.define('taskaction', {
  action: {
    allowNull: true,
    unique: false,
    type: DataTypes.STRING,
  }
});

Task.hasMany(TaskAction, { onDelete: "cascade" });
TaskAction.belongsTo(Task);

module.exports = TaskAction;
