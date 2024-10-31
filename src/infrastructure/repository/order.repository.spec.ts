import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../db/sequelize/model/customer.model";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import OrderModel from "../db/sequelize/model/order.model";
import ProductModel from "../db/sequelize/model/product.model";
import CustomerRepository from "./customer.repository";
import Customer from "../../domain/entity/customer";
import Address from "../../domain/entity/address";
import ProductRepository from "./product.repository";
import Product from "../../domain/entity/product";
import OrderItem from "../../domain/entity/ordem-item";
import Order from "../../domain/entity/order";
import OrderRepository from "./order.repository";

describe("Order repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([CustomerModel, OrderModel, OrderItemModel, ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a new order", async () => { 
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Strret 1", 1, "Zip-code", "Lisboa");
  
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem("1", product.name, product.price, product.id, 2);
    const order = new Order("123", "123", [orderItem]);
    const orderRepository = new OrderRepository();
    await orderRepository.create(order);
    
    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"]
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "123",
      customerId: "123",
      total: order.total(),
      items: [{
        id: orderItem.id,
        name: orderItem.name,
        price: orderItem.price,
        quantity: orderItem.quantity,
        orderId: "123",
        productId: "123"
      }]
    })
  });

  it("should update a order", async () => {
    let orderModel;
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Strret 1", 1, "Zip-code", "Lisboa");
  
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem("1", product.name, product.price, product.id, 2);
    const order = new Order("123", "123", [orderItem]);
    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"]
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "123",
      customerId: "123",
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          orderId: "123",
          productId: "123"
        }
      ]
    })

    const product2 = new Product("1234", "Product 2", 20);
    await productRepository.create(product2);
    const orderItem2 = new OrderItem("2", product2.name, product2.price, product2.id, 1);
    order.changeItems([orderItem, orderItem2]);
    await orderRepository.update(order);
    
    orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"]
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "123",
      customerId: "123",
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          orderId: "123",
          productId: "123"
        },
        {
          id: orderItem2.id,
          name: orderItem2.name,
          price: orderItem2.price,
          quantity: orderItem2.quantity,
          orderId: "123",
          productId: "1234"
        }
      ]
    })
  });

  it("should find a order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Strret 1", 1, "Zip-code", "Lisboa");
  
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem("1", product.name, product.price, product.id, 2);
    const order = new Order("123", "123", [orderItem]);
    const orderRepository = new OrderRepository();
    await orderRepository.create(order);
    
    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"]
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "123",
      customerId: "123",
      total: order.total(),
      items: [{
        id: orderItem.id,
        name: orderItem.name,
        price: orderItem.price,
        quantity: orderItem.quantity,
        orderId: "123",
        productId: "123"
      }]
    })
  });

  it("should find all orders", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Strret 1", 1, "Zip-code", "Lisboa");
  
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const orderRepository = new OrderRepository();
    const orderItem1 = new OrderItem("1", product.name, product.price, product.id, 2);
    const order1 = new Order("123", "123", [orderItem1]);
    await orderRepository.create(order1);

    const orderItem2 = new OrderItem("2", product.name, product.price, product.id, 2);
    const order2 = new Order("1234", "123", [orderItem2]);
    await orderRepository.create(order2);

    const orders = await orderRepository.findAll();

    expect(orders).toHaveLength(2);
    expect(orders).toContainEqual(order1);
    expect(orders).toContainEqual(order2);
  });
});