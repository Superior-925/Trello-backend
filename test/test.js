const express = require('express');
const Board = require('../src/models/board');

const router = express.Router();

router.post('/test',
  async (req, res) => {
    const board = new Board({
      boardName: req.body.boardName,
    });
    try {
      await board.save();
      res.send(board);
    } catch (e) {
      res.status(422).send({ message: 'Board cannot be created!' });
    }
  });

router.get('/test',
  async (req, res) => {
    const boards = await Board.findAll();
    res.send(boards);
  });

module.exports = router;
