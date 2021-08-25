const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const RefreshToken = require('../models/refresh-token');
const utils = require('../lib/utils');

const router = express.Router();

const issueTokensPair = async (userId) => {
  try {
    const newRefreshToken = new RefreshToken({
      userId,
      token: utils.issueRefreshToken(),
    });

    const refreshToken = await newRefreshToken.save();
    const tokenObject = utils.issueJWT(userId);

    return {
      token: tokenObject.token,
      expiresIn: tokenObject.expiresIn,
      refresh: refreshToken,
    };
  } catch (e) {
    console.log(e);
  }
};

router.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  const alreadyExistsUser = await User.findOne({ where: { email } }).catch(
    (err) => {
      console.log('Error: ', err);
      res.status(500).json({ message: err });
    }
  );

  if (alreadyExistsUser) {
    return res.status(409).json({ message: 'User with email already exists!' });
  }

  const saltHash = utils.genPassword(password);

  const { salt } = saltHash;
  const { hash } = saltHash;

  const newUser = new User({ email, hash, salt });
  const savedUser = await newUser.save().catch((err) => {
    console.log('Error: ', err);
    res.status(500).json({ error: 'Cannot register user at the moment!' });
  });
  if (savedUser) {
    const tokenPair = await issueTokensPair(savedUser.id);
    res.status(200).json({
      success: true,
      userId: savedUser.id,
      ...tokenPair,
    });
  }
});

router.post('/signup/google', async (req, res) => {
  const { email, provider } = req.body;

  const alreadyExistsUser = await User.findOne({ where: { email } }).catch(
    (err) => {
      console.log('Error: ', err);
      res.status(500).json({ message: err });
    }
  );

  if (alreadyExistsUser && alreadyExistsUser.provider === provider) {
    await RefreshToken.destroy({ where: { userId: alreadyExistsUser.id } });
    const tokenPair = await issueTokensPair(alreadyExistsUser.id);
    res.status(200).json({
      userId: alreadyExistsUser.id,
      success: true,
      ...tokenPair,
    });
  }

  if (!alreadyExistsUser) {
    const newUser = new User({ email, provider });
    const savedUser = await newUser.save().catch((err) => {
      console.log('Error: ', err);
      res.status(500).json({ error: 'Cannot register user at the moment!' });
    });
    if (savedUser) {
      const tokenPair = await issueTokensPair(savedUser.id);

      res.status(200).json({
        userId: savedUser.id,
        success: true,
        ...tokenPair,
      });
    }
  }
});

module.exports = router;
