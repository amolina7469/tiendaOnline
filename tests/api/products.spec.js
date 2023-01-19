const mongoose = require('mongoose');
const request = require('supertest');

const app = require('../../app');
const Product = require('../../models/product.model');


describe('Api de products', () => {

  beforeAll(async () => {
    //Conectar a la BD
    mongoose.set('strictQuery', false);
    await mongoose.connect('mongodb://127.0.0.1:27017/tienda_online');
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Desconecto la base de datos
  });

  describe('GET /api/products', () => {
    let response;
    beforeAll(async () => {
      response = await request(app).get('/api/products').send();
    });

    it('debería responder con status 200', () => {
      expect(response.statusCode).toBe(200);
    });

    it('debería devolver datos en formato JSON', () => {
      expect(response.headers['content-type']).toContain('json');
    });

    it('debería devolver un array', () => {
      expect(response.body).toBeInstanceOf(Array);
    });


  });

  describe('POST /api/products', () => {
    // la BD despues de las pruebas debe quedar como nos la encontramos
    let response;
    const body = { name: 'producto prueba', description: 'Es para probar', price: 128, available: true, stock: 300, department: 'test', image: '' };

    beforeAll(async () => {
      response = await request(app).post('/api/products').send(body);
    });

    afterAll(async () => { //Dejamos la base de datos como estaba
      await Product.deleteMany({ department: 'test' });
    });

    it('debería responder status 200', () => {
      expect(response.statusCode).toBe(200);
    });

    it('debería devolver datos en formato JSON', () => {
      expect(response.headers['content-type']).toContain('json');
    });
    it('debería comprobar si se ha insertado el producto', () => {
      expect(response.body._id).toBeDefined();
      expect(response.body.name).toBe(body.name);
    });
  });

  describe('PUT /api/products/PRODUCTID', () => {
    // Crear un objeto de prueba en la BD.
    // Ejecutaremos la petición.
    let response;
    let product;
    const body = { name: 'producto prueba', description: 'Es para probar', price: 128, available: true, stock: 300, department: 'test', image: '' };

    beforeAll(async () => {
      product = await Product.create({ body });
      response = await request(app)
        .put(`/api/products/${product._id}`)
        .send({ price: 210, stock: 120 });
    });

    afterAll(async () => {
      await Product.findByIdAndDelete(product._id);
    });

    it('debería responder status 200 y Content-type', () => {
      expect(response.statusCode).toBe(200);
      expect(response.headers['content-type']).toContain('json');
    });

    it('debería realizarse la modificación en el documento', () => {
      expect(response.body.price).toBe(210);
      expect(response.body.stock).toBe(120);
    });
  });

  describe('DELETE /api/products/PRODUCTID', () => {
    let response, product;

    beforeAll(async () => {
      product = await Product.create({ name: 'producto prueba', description: 'Es para probar', price: 128, available: true, stock: 300, department: 'test', image: '' });
      response = await (request(app).delete(`/api/products/${product._id}`)).send();;

    });

    afterAll(async () => {
      await Product.findByIdAndDelete(product._id);
    });

    it('debería responder status 200 y Content-type ', () => {
      expect(response.statusCode).toBe(200);
      expect(response.headers['content-type']).toContain('json');
    });

    it('debería borrarse de la BD', async () => {
      const productFound = await Product.findById(product._id);
      expect(productFound).toBeNull();
    });

    it('debería responder con el objeto borrado', () => {
      expect(response.body._id.toString()).toBe(product._id.toString());
      expect(response.body.name).toBe(product.name);
    });

  });
});