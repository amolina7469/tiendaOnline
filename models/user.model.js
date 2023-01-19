const { model, Schema } = require('mongoose');

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, 'El campo username es obligatorio'] //validación
  },
  email: String,
  password: String,
  address: String,
  age: {
    type: Number,
    min: 0, //validación
    max: 100//validación
  },
  role: {
    type: String,
    enum: ['regular', 'admin', 'moderator']//validación
  },
  products: [{
    type: Schema.Types.ObjectId,// le ponemos de tipo ObjectId que es el tipo que tiene en la BD
    ref: 'product' //este es el modelo al que apunta
  }]
});

module.exports = model('user', userSchema);