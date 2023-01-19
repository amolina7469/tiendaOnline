const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const User = require('../../models/user.model');

const checkToken = async (req, res, next) => {
  //comprobar si el token viene en la cabecera
  if (!req.headers['authorization']) {
    return res.json({ fatal: 'Debes incluir el token' });
  }
  const token = req.headers['authorization'];

  //comprobar si el token es el correcto
  let payload;
  try {
    payload = jwt.verify(token, process.env.SECRET_KEY);
  } catch (error) {
    return res.json({ fatal: 'El token es incorrecto' });
  }

  //recuperar el usuario
  req.user = await User.findById(payload.user_id);

  //dar paso al siguiente manejador
  next();
}

const checkErrors = (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const mensajes = errors.array().map(error => error.msg);
    return res.json(mensajes);
  } else {
    next();
  }

}

module.exports = {
  checkToken,
  checkErrors
}