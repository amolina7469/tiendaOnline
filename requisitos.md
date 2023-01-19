# Api de productos

## GET /api/products

  - Recupera todos los productos de la base de datos.
  - PRUEBAS:
    - Status que devuelve es 200.
    - La respuesta debe tener formato JSON.
    - La respuesta debe ser un array de productos.
    - Los elementos dentro del array tienen que ser productos.

## POST /api/products

  - Creación de un producto en la BD.
  - A través del body le hago llegar todos los datos del nuevo producto.
  - Como respuesta recibiremos todos los datos del nuevo producto.
  - PRUEBAS:
    - Status 200.
    - La respuesta debe tener formato JSON.
    - Comprobar si se ha inseratdo el producto.

## PUT /api/products/PRODUCTID

  - Actualiza los datos de un producto en la BD.
  - El id del producto a actualizar lo recibe la URL.
  - Los datos del producto para su actualización se reciben en req.body.
  - La respuesta debe ser el producto modificado.
  - PRUEBAS:
    - Status que devuelve es 200 y Content-type: applications/json.
    - Debemos comprobar si los datos devueltos en la respuesta coinciden con la modificación realizada.


## DELETE /api/products/PRODUCTID

  - Borra un producto de la BD.
  - El id del producto a borrar lo recibimos a través de la URL.
  - La respuesta debe incluir los datos del producto borrado.
  - PRUEBAS:
    - Status que devuelve es 200 y Content-type: applications/json.
    - Comprobar si los datos de la respuesta se corresponden con el producto borrado.
    - Comprobar si el producto sigue en la BD.

## GET /api/products/DEPARTAMENTO

  - Recupera todos los productos del departamento que adjuntemos en la URL
  - fin(FILTRO)

## GET /api/products/min/PRECIOMIN/max/PRECIOMAX

  - Recupera los productos en un margen de precio
  - Los precios están en la url
  - find(FILTRO) -$gt, $lt, %gte, $lte

## GET /api/products/actives

  - Recupera los productos disponibles y con stock mayor que 0
  - find(FILTRO)

## GET /api/users/cart

  - Recupera un array con todos los productos del usuario autenticado.

## GET api/users/cart/remove/PRODUCTID

  - Pasamos el id del producto a través de la url y borramos dicho producto del carrito del usuario autenticado.