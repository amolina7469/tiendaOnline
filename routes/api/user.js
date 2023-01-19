const router = require('express').Router();
const bcrypt = require('bcryptjs');
const { body } = require('express-validator');

const User = require('../../models/user.model');
const { checkToken, checkErrors } = require('../../tests/helpers/middlewares');
const { createToken } = require('../../tests/helpers/util');

router.get('/', checkToken, async (req, res) => {
  try {
    const users = await User.find().populate('products');//con populate sacamos los datos de los id de productos
    res.json(users);
  } catch (err) {
    res.json({ fatal: err.message });
  }
});

router.get('/cart', checkToken, async (req, res) => {
  const user = await req.user.populate('products');
  res.json(user.products);
});

router.get('/cart/add/:productId', checkToken, async (req, res) => {
  const { productId } = req.params;
  req.user.products.push(productId);
  await req.user.save();
  res.json({ success: 'Producto insertado' });
});

router.get('/cart/remove/:productId', checkToken, async (req, res) => {
  const { productId } = req.params;
  // req.user.products.splice(productId, 1);//otra forma de eliminar
  req.user.products.pull(productId);
  await req.user.save();
  res.json({ success: 'Producto eliminado' });
});

router.post('/',
  body('username')
    .exists().withMessage('El username es requerido')
    .isLength({ min: 3 }).withMessage('El campo username debe tener más de 3 caracteres'),
  body('email')
    .isEmail().withMessage('El email debe ser correcto'),
  body('password')
    .matches(/^(?=.*\d)(?=.* [a - z])(?=.* [A - Z]).{ 4, 8}$/).withMessage('La password es incorrecta'),
  body('role')
    .isIn(['regular', 'admin', 'moderator']).withMessage('El rol no está admitido'),
  body('age')
    .custom((value) => {
      return value >= 18 && value <= 65;
    }).withMessage('La edad debe estar entre 18 y 65 años'),
  checkErrors//Comprobamos errores en un middleware
  , async (req, res) => {
    try {
      req.body.password = bcrypt.hashSync(req.body.password, 9);//encriptamos la password
      const user = await User.create(req.body);
      console.log(user);
      res.json(user);
    } catch (err) {
      res.json({ fatal: err.message });
    }
  });

router.post('/login', async (req, res) => {
  try {
    // ¿Existe el email en la BD?
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.json({ fatal: 'Error en usuario y/o contraseña' });
    }
    // ¿Coinciden las password?
    const equals = bcrypt.compareSync(req.body.password, user.password);
    console.log(req.body.password, user.password);
    if (!equals) {
      return res.json({ fatal: 'Error en usuario y/o contraseña' });
    }
    res.json({
      success: 'Login correcto',
      token: createToken(user)
    });
  } catch (err) {
    res.json({ fatal: err.message });
  }
});

router.put('/:userId', checkToken, async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findByIdAndUpdate(userId, req.body, { new: true });
    res.json(user);
  } catch (err) {
    res.json({ fatal: err.message });
  }
});

router.delete('/:userId', checkToken, async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findByIdAndDelete(userId);
    res.json(user);
  } catch (err) {
    res.json({ fatal: err.message });
  }
});

module.exports = router;