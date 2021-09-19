const express = require('express');
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
  } catch (error) {
    console.log(error);
  }
  return null;
};

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const userWithEmail = await User.findOne({ where: { email } }).catch(
    (err) => {
      console.log('Error: ', err);
      res.status(500).json({ message: err });
    }
  );

  // comparsion of emails

  if (!userWithEmail) {
    return res
      .status(401)
      .json({ message: 'Email or password does not match!' });
  }

  const isValid = utils.validPassword(password, userWithEmail.hash, userWithEmail.salt);

  if (isValid) {
    await RefreshToken.destroy({ where: { userId: userWithEmail.id } });
    const tokenPair = await issueTokensPair(userWithEmail.id);

    res.status(200).json({
      userId: userWithEmail.id,
      success: true,
      ...tokenPair,
    });
  } else {
    res.status(401).json({ success: false, message: 'you entered the wrong password' });
  }
  return null;
});

router.post('/logout', async (req, res, next) => {
  const { accessToken } = req.body;

  if (!accessToken) {
    return res.status(401).json({ message: 'Token not provided!' });
  }

  const token = accessToken.replace('Bearer ', '');
  const data = utils.verifyToken(token, true); // ignore expiration here

  try {
    await RefreshToken.destroy({ where: { userId: data.sub } });

    res.status(200).json({
      success: true,
    });
  } catch (err) {
    next(err);
  }
  return null;
});

router.post('/refresh', async (req, res, next) => {
  const { refreshToken } = req.body;

  try {
    const refreshTokenData = await RefreshToken.findOne({ where: { token: refreshToken } });
    if (!refreshTokenData) {
      return res.status(404).json({
        message: 'Refresh token not found',
      });
    }

    if (!utils.verifyToken(refreshTokenData.token)) {
      return res.status(406).json({ message: 'Invalid refresh token or token expired!' });
    }

    await RefreshToken.destroy({ where: { token: refreshToken } });

    const tokenPair = await issueTokensPair(refreshTokenData.userId);

    res.status(200).json({
      success: true,
      ...tokenPair,
    });
  } catch (err) {
    next(err);
  }
  return null;
});

module.exports = router;
