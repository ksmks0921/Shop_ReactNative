const obj = {
  shipping: {
    contact_name: String,
    street: String,
    num_ext: String,
    num_int: INT,
    zipcode: INT,
    phone: String,
    cellphone: String,
    suburbs_id: INT,
    cities_id: INT
  },
  billing: {
    suburbs_id: INT,
    cities_id: INT,
    commercial_name: String,
    bussiness_name: String,
    email: String,
    zipcode: String,
    street: String,
    num_ext: INT,
    num_int: String,
    phone: String,
    rfc: String
  },
  products: {
    product_id: INT,
    price: double,
    color_id: INT,
    qty: INT,
    size_id: INT
  },
  order: {
    order_status: INT,
    subtotal: double,
    iva: double,
    total: double,
    num_items: INT,
    discount: INT,
    shipping_cost: double
  }
}
