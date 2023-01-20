const router = require('express').Router();
const { checkSchema } = require('express-validator');
const multer = require('multer');
const upload = multer({ dest: 'public/images' });
const fs = require('fs');

const Product = require('../../models/product.model');
const { checkErrors } = require('../../tests/helpers/middlewares');
const { newProduct } = require('../../tests/helpers/validators');


router.get('/', async (req, res) => {

  const { page = 1, limit = 3 } = req.query;
  console.log(page, limit);
  /**
  * page = 1 skip = 0 limit = 5
  * page = 2 skip = 5 limit = 5
  * page = 3 skip = 10 limit = 5
  */
  try {
    const products = await Product.find()
      .skip((page - 1) * limit)//calculo de los productos que salta por página según el limite
      .limit(limit)//coge el limit que le pasemos en la url 
      .populate('owner');

    const total = await Product.count();//Productos totales de la colección (tabla)
    console.log(total);
    res.json({
      info: {
        current_page: parseInt(page),
        count: total,
        pages: Math.ceil(total / limit) //redondeamos el resultado hacía arriba
      },
      results: products
    })
    // for (let product of products) {
    //   console.log(product.price_tax);//propiedad calculada
    // }
  } catch (err) {
    res.json({ fatal: err.message });
  }
});

router.post('/',
  upload.single('image'),
  checkSchema(newProduct),
  checkErrors
  , async (req, res) => {
    try {
      //agregamos la extensión a la imagen
      const extension = req.file.mimetype.split('/')[1];
      const newPath = `${req.file.path}.${extension}`;
      fs.renameSync(req.file.path, newPath);

      req.body.image = `${req.file.filename}.${extension}`;
      req.body.owner = req.user._id; //Añadimos a la propiedad owner el id del user que ha creado el producto

      const product = await Product.create(req.body);
      res.json(product);
    } catch (err) {
      res.json({ fatal: err.message });
    }
  });

router.put('/:productId', async (req, res) => {
  const { productId } = req.params;
  try {
    const product = await Product.findByIdAndUpdate(productId, req.body, { new: true });
    res.json(product);
  } catch (err) {
    res.json({ fatal: err.message });
  }
});

router.delete('/:productId', async (req, res) => {
  const { productId } = req.params;
  try {
    const product = await Product.findByIdAndDelete(productId);
    res.json(product);
  } catch (err) {
    res.json({ fatal: err.message });
  }
});

router.get('/actives', async (req, res) => {
  try {
    const products = await Product.actives();
    // const products = await Product.find({ $or: [{ stock: 0 }, { available: false }] }); //para productos no disponibles
    res.json(products);
  } catch (err) {
    res.json({ fatal: err.message })
  }
});

router.get('/:departamento', async (req, res) => {
  const { departamento } = req.params;
  console.log(departamento);
  try {
    const products = await Product.find({ department: departamento });
    res.json(products);
  } catch (err) {
    res.json({ fatal: err.message });
  }
});

router.get('/min/:minPrice/max/:maxPrice', async (req, res) => {
  const { minPrice, maxPrice } = req.params;
  try {
    const products = await Product.find({ price: { $gt: minPrice, $lt: maxPrice } });
    res.json(products);
  } catch (err) {
    res.json({ fatal: err.message })
  }
});



module.exports = router;