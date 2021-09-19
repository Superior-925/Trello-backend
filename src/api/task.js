const { Op } = require('sequelize');
const express = require('express');
const passport = require('passport');

const Task = require('../models/task');
const Board = require('../models/board');
const User = require('../models/user');
const Taskexecutor = require('../models/task-executor');
const TaskAction = require('../models/task-action');
const List = require('../models/lists-tasks');

const router = express.Router();

function taskAction(taskId, action) {
  Task.findByPk(taskId).then((task) => {
    task.createTaskaction({ action }).catch((err) => console.log(err));
  }).catch((err) => console.log(err));
  return null;
}

router.post('/task', passport.authenticate('jwt', { session: false }),

  (req, res) => {
    try {
      const {
        taskTitle, order, listId
      } = req.body;
      List.findByPk(listId).then((list) => {
        if (!list) return res.status(404).json({ message: 'List not found!' });
        list.createTask({ taskTitle, order }).then((task) => {
          taskAction(task.dataValues.id, 'Adding a task');
          Task.findOne({ where: { id: task.dataValues.id }, include: { model: List } }).then((getTask) => {
            const newTask = getTask.get({ plain: true });
            res.status(200).send(newTask);
          });
        }).catch((err) => console.log(err));
        return null;
      });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  });

router.get('/task', passport.authenticate('jwt', { session: false }),
  (req, res) => {
    try {
      const boardId = req.query.param;

      Board.findByPk(boardId).then((board) => {
        if (!board) return res.status(404).json({ message: 'Board not found!' });
        board.getLists({ include: [{ model: Task, where: { archived: false } }] })
          .then((listsTasks) => {
            res.status(200).send(listsTasks);
          })
          .catch((err) => console.log(err));
        return null;
      });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  });

router.delete('/task', passport.authenticate('jwt', { session: false }),
  (req, res) => {
    try {
      const taskId = req.query.param;
      const { taskIds } = req.query;
      if (taskId) {
        Task.findByPk(taskId).then((task) => {
          if (!task) return res.status(404).json({ message: 'Task not found!' });
          task.destroy();
          const resJson = JSON.stringify(task.dataValues.id);
          res.send(resJson);
          return null;
        });
      }

      if (taskIds) {
        Task.destroy({ where: { id: taskIds } });
        res.status(200).json({ message: 'Removal is successful!' });
      }
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  });

router.put('/task', passport.authenticate('jwt', { session: false }),
  (req, res) => {
    try {
      const {
        taskId, taskTitle, taskText
      } = req.body;
      Task.findByPk(taskId).then((task) => {
        if (!task) return res.status(404).json({ message: 'Task not found!' });
        if (taskTitle != null && taskText == null) {
          taskAction(taskId, 'Rename a title or task text');
          task.taskTitle = taskTitle;
          task.save();
          res.status(200).send(task);
        }
        if (taskTitle == null && taskText != null) {
          taskAction(taskId, 'Rename a title or task text');
          task.taskText = taskText;
          task.save();
          res.status(200).send(task);
        }
        return null;
      });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  });

router.get('/task/search', passport.authenticate('jwt', { session: false }),
  (req, res) => {
    try {
      const { boardId, taskTitle } = req.query;

      if (taskTitle.charAt(0) === '@') {
        const subText = taskTitle.substring(1);
        Board.findByPk(boardId).then((board) => {
          if (!board) return res.status(404).json({ message: 'Board not found!' });
          board.getLists({
            include: [{
              model: Task,
              include: { model: User, where: { email: subText }, required: true }
            }]
          })
            .then((listsTasks) => {
              res.status(200).send(listsTasks);
            })
            .catch((err) => console.log(err));
          return null;
        });
      } else {
        Board.findByPk(boardId).then((board) => {
          if (!board) return res.status(404).json({ message: 'Board not found!' });
          board.getLists({
            include: [{
              model: Task,
              where: {
                taskTitle: { [Op.like]: `%${taskTitle}%` },
                archived: false
              }
            }]
          })
            .then((listsTasks) => {
              res.status(200).send(listsTasks);
            })
            .catch((err) => console.log(err));
          return null;
        });
      }
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  });

router.post('/task/executor', passport.authenticate('jwt', { session: false }),

  (req, res) => {
    try {
      const { taskId, userId } = req.body;

      User.findByPk(userId)
        .then((user) => {
          if (!user) res.status(404).json({ message: 'User not found!' });
          Task.findByPk(taskId)
            .then((task) => {
              if (!task) res.status(404).json({ message: 'Task not found!' });
              taskAction(taskId, 'Adding a executor');
              user.addTask(task, { through: { executor: true } }).then(() => {
                res.send({ task, user });
              });
            });
        });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  });

router.get('/task/executor:board', passport.authenticate('jwt', { session: false }),
  (req, res) => {
    try {
      const boardId = req.params;

      Board.findByPk(boardId.board).then((board) => {
        if (!board) return res.status(404).json({ message: 'Board not found!' });
        board.getLists({
          include: [{
            model: Task,
            include: { model: User, required: true }
          }]
        })
          .then((listsTasks) => {
            res.status(200).send(listsTasks);
          })
          .catch((err) => console.log(err));
        return null;
      });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  });

router.delete('/task/executor', passport.authenticate('jwt', { session: false }),

  (req, res) => {
    try {
      const { taskId, userId } = req.query;

      Taskexecutor.findOne({ where: { taskId, userId } }).then((task) => {
        task.destroy();
        taskAction(taskId, 'Deleting a executor');
        res.send(task);
      }).catch((err) => console.log(err));
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  });

router.patch('/task', passport.authenticate('jwt', { session: false }),

  (req, res) => {
    try {
      Task.findAll({ where: { id: req.body } }).then((tasks) => {
        tasks.forEach((task) => {
          task.archived = true;
          task.save();
        });
        res.status(200).json({ message: 'Archiving completed successfully' });
      });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  });

router.patch('/task:taskId', passport.authenticate('jwt', { session: false }),

  (req, res) => {
    try {
      const taskId = req.params;
      Task.findByPk(taskId.taskId).then((task) => {
        task.archived = true;
        task.save();
        res.status(200).send(task);
      });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  });

router.get('/task/archive', passport.authenticate('jwt', { session: false }),
  (req, res) => {
    try {
      const boardId = req.query.param;

      Board.findByPk(boardId).then((board) => {
        if (!board) return res.status(404).json({ message: 'Board not found!' });
        board.getLists({ include: [{ model: Task, where: { archived: true } }] })
          .then((listsTasks) => {
            res.status(200).send(listsTasks);
          })
          .catch((err) => console.log(err));
        return null;
      });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  });

router.put('/task/archive', passport.authenticate('jwt', { session: false }),
  (req, res) => {
    try {
      const { archivedTasks, listId } = req.body;

      Task.findAll({ where: { id: archivedTasks } }).then((tasks) => {
        if (!tasks) return res.status(404).json({ message: 'Tasks not found!' });
        tasks.forEach((task) => {
          task.listId = listId;
          task.archived = false;
          task.save();
        });
        res.status(200).send(tasks);
        return null;
      });
      Taskexecutor.destroy({ where: { taskId: archivedTasks } }).catch((err) => console.log(err));
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  });

router.put('/task/archive:taskId', passport.authenticate('jwt', { session: false }),
  (req, res) => {
    try {
      const taskId = req.params;
      Task.findByPk(taskId.taskId).then((task) => {
        task.archived = false;
        task.save();
        res.status(200).send(task);
      });

      Taskexecutor.destroy({ where: { taskId: taskId.taskId } }).catch((err) => console.log(err));
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  });

router.get('/task/actions:board', passport.authenticate('jwt', { session: false }),
  (req, res) => {
    try {
      const boardId = req.params;

      Board.findByPk(boardId.board).then((board) => {
        if (!board) return res.status(404).json({ message: 'Board not found!' });
        board.getLists({ include: [{ model: Task, include: TaskAction }] })
          .then((tasksActions) => {
            res.status(200).send(tasksActions);
          })
          .catch((err) => console.log(err));
        return null;
      });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  });

router.put('/task/list:taskId', passport.authenticate('jwt', { session: false }),
  (req, res) => {
    try {
      const { task, listId } = req.body;
      const taskId = req.params;

      Task.findByPk(taskId.taskId).then((item) => {
        if (!item) return res.status(404).json({ message: 'Task not found!' });
        item.order = task.order;
        item.listId = listId;
        item.save();
        taskAction(taskId.taskId, 'Changing the task list');
        res.status(200).json({ message: 'List changing is completed' });
        return null;
      });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  });

router.put('/task/order:taskId', passport.authenticate('jwt', { session: false }),
  (req, res) => {
    try {
      const { taskOrder } = req.body;
      const taskId = req.params;

      Task.findByPk(taskId.taskId).then((task) => {
        if (!task) return res.status(404).json({ message: 'Task not found!' });
        task.order = taskOrder;
        task.save();
        taskAction(taskId.taskId, 'Changing the task position');
        res.status(200).json({ message: 'Order changing is completed' });
        return null;
      });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  });

module.exports = router;
