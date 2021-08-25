const express = require('express');
const registerApi = require('./registration');
const loginApi = require('./login');
const boardAdd = require('./board');
const taskAdd = require('./task');
const test = require('./test');

const router = express.Router();

router.use(registerApi);
router.use(loginApi);
router.use(boardAdd);
router.use(taskAdd);
router.use(test);

module.exports = router;
