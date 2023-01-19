const mongoose = require('mongoose');

const Product = require('./models/product.model');
const User = require('./models/user.model')


  (async () => {

    mongoose.set('strictQuery', false);
    await mongoose.connect('mongodb://127.0.0.1:27017/tienda_online');

    // const response = await Product.create({
    //   name: 'Pantalones azules',
    //   description: 'Son para las piernas',
    //   price: 34,
    //   department: 'moda',
    //   available: true,
    //   stock: 28,
    //   image: 'https://www.bolf.es/spa_pl_Pantalon-chino-para-hombre-color-marron-Bolf-1146-86886_9.jpg'
    // });

    // const products = await Product.find(); //Obtenemos todos los productos

    // const products = await Product.find({ //Filtramos por precio
    //   price: { $gt: 40 }, //$gt(>), $gte(>=), $lt(<), $lte(<=)
    //   available: true
    // });

    // const products = await Product.findOne({
    //   stock: { $lte: 30 } // devuelve el primer producto que el stock es menor o igual que 30
    // });

    // console.log(products);

    const user = await User.create({
      username: 'mario',
      email: 'mario@mail.com',
      password: '12345',
      address: 'C Gran via 23',
      age: 23,
      role: 'admin'
    });
    console.log(user);

    await mongoose.disconnect();
  })(); 