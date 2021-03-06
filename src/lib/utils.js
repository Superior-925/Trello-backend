const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const uuid = require('uuid').v4;

const pathToPrivateKey = path.join(__dirname, '..', 'id_rsa_priv.pem');
const PRIV_KEY = fs.readFileSync(pathToPrivateKey, 'utf8');
const pathToPubliceKey = path.join(__dirname, '..', 'id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToPubliceKey, 'utf8');

/**
 * -------------- HELPER FUNCTIONS ----------------
 */

/**
 *
 * @param {*} password - The plain text password
 * @param {*} hash - The hash stored in the database
 * @param {*} salt - The salt stored in the database
 *
 * This function uses the crypto library to decrypt the hash using the salt and then compares
 * the decrypted hash/salt with the password that the user provided at login
 */
function validPassword(password, hash, salt) {
  const hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return hash === hashVerify;
}

/**
 *
 * @param {*} password - The password string that the user inputs to the password field in the register form
 *
 * This function takes a plain text password and creates a salt and hash out of it.  Instead of storing the plaintext
 * password in the database, the salt and hash are stored for security
 *
 * ALTERNATIVE: It would also be acceptable to just use a hashing algorithm to make a hash of the plain text password.
 * You would then store the hashed password in the database and then re-hash it to verify later (similar to what we do here)
 */
function genPassword(password) {
  const salt = crypto.randomBytes(32).toString('hex');
  const genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');

  return {
    salt,
    hash: genHash,
  };
}

const genToken = (payload, expiresIn) => jwt.sign(payload, PRIV_KEY, {
  expiresIn,
  algorithm: 'RS256',
});

/**
 * @param {*} user - The user object.  We need this to set the JWT `sub` payload property to the Postgre user ID
 */
function issueJWT(id) {
  const expiresIn = '5m';

  const payload = {
    sub: id,
  };

  return {
    token: `Bearer ${genToken(payload, expiresIn)}`,
    expiresIn,
  };
}

function issueRefreshToken() {
  const expiresIn = '10m';

  const payload = { token: uuid() };

  return genToken(payload, expiresIn);
}

function verifyToken(token, ignoreExpiration = false) {
  try {
    const payload = jwt.verify(token, PUB_KEY, { ignoreExpiration });
    return payload;
  } catch (e) {
    return false;
  }
}

module.exports.validPassword = validPassword;
module.exports.genPassword = genPassword;
module.exports.issueJWT = issueJWT;
module.exports.issueRefreshToken = issueRefreshToken;
module.exports.verifyToken = verifyToken;
