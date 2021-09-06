const express = require('express');
const passport = require('passport');

const crypto = require('crypto');

const User = require('../models/user');
const Board = require('../models/board');
const Userboards = require('../models/user-boards');

const router = express.Router();

const key = crypto.createHash('sha256').update('OMGCAT!', 'ascii').digest();
const iv = '1234567890123456';

router.post('/board', passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const { boardName, userId } = req.body;
      console.log(`UserId ${userId}`);
      await Board.create({ boardName }).catch((err) => console.log(err));
      User.findByPk(userId)
        .then((user) => {
          if (!user) return res.status(404).json({ message: 'User not found!' });
          Board.findOne({ where: { boardName } })
            .then((board) => {
              if (!board) return res.status(404).json({ message: 'Board not found!' });
              user.addBoard(board, { through: { owner: true } }).then(() => {
                res.send(board);
              });
              return null;
            });
          return null;
        });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  });

router.get('/board', passport.authenticate('jwt', { session: false }), (req, res) => {
  try {
    const userId = req.query.param;
    User.findByPk(userId)
      .then((user) => {
        if (!user) return res.status(404).json({ message: 'User not found!' });
        user.getBoards().then((boards) => {
          res.send(boards);
        });
        return null;
      });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

router.delete('/board', passport.authenticate('jwt', { session: false }), (req, res) => {
  try {
    const { userId } = req.query;
    const { boardId } = req.query;

    User.findByPk(userId)
      .then((user) => {
        if (!user) return res.status(404).json({ message: 'User not found!' });
        user.getBoards().then((boards) => {
          boards.forEach((board) => {
            if (board.dataValues.id == boardId) {
              board.destroy();
              board.userboard.destroy();
              const resJson = JSON.stringify(board.dataValues.id);
              res.send(resJson);
            }
          });
        });
        return null;
      });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

router.put('/board', passport.authenticate('jwt', { session: false }), (req, res) => {
  try {
    const { boardId, boardName } = req.body;

    Board.findByPk(boardId).then((board) => {
      if (!board) return res.status(404).json({ message: 'Board not found!' });
      board.boardName = boardName;
      board.save();
      res.send(board);
      return null;
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

router.post('/board/invitation', passport.authenticate('jwt', { session: false }),
  (req, res) => {
    try {
      const { boardId } = req.body;

      const stringBoardId = boardId.toString();

      // this is the string we want to encrypt/decrypt
      const secret = stringBoardId;

      // create a aes256 cipher based on our password
      const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
      // update the cipher with our secret string
      cipher.update(secret, 'ascii');
      // save the encryption as base64-encoded
      const encrypted = cipher.final('hex');

      // create a aes256 decipher based on our password
      const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
      // update the decipher with our encrypted string
      decipher.update(encrypted, 'hex');

      res.send(JSON.stringify(`http://localhost:4200/link/${encrypted}`));
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  });

router.post('/board/invitation/:link', passport.authenticate('jwt', { session: false }), (req, res) => {
  try {
    const { link } = req.params;
    const { userId } = req.query;

    // create a aes256 decipher based on our password
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    // update the decipher with our encrypted string
    decipher.update(link, 'hex');

    const decryptBoard = decipher.final('ascii');

    Userboards.findOne({ where: { boardId: decryptBoard } }).then((board) => {
      if (!board) return res.status(404).json({ message: 'Board not found!' });
      if (board.userId == userId) { return res.status(409).json({ message: 'Error, you are owner' }); }
      User.findByPk(userId)
        .then((user) => {
          if (!user) return res.status(404).json({ message: 'User not found!' });
          Board.findByPk(decryptBoard)
            .then((board) => {
              if (!board) res.status(404).json({ message: 'Board not found!' });
              user.addBoard(board, { through: { owner: false } }).then(() => {
                res.status(200).json({ message: 'Successful' });
              });
            });
          return null;
        });
      return null;
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

router.get('/board/invitation/users/:board', passport.authenticate('jwt', { session: false }), (req, res) => {
  try {
    const boardId = req.params;

    Board.findByPk(boardId.board)
      .then((board) => {
        if (!board) return res.status(404).json({ message: 'Board not found!' });
        board.getUsers().then((users) => {
          res.send(users);
        });
        return null;
      });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

router.get('/board/rights', passport.authenticate('jwt', { session: false }), (req, res) => {
  try {
    const { userId } = req.query;
    const { boardId } = req.query;

    Userboards.findOne({ where: { userId, boardId } }).then((board) => {
      if (!board) return res.status(404).json({ message: 'Board not found!' });
      res.send(board);
      return null;
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = router;
