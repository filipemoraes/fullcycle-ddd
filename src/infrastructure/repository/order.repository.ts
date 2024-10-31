import Order from "../../domain/entity/order";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import OrderModel from "../db/sequelize/model/order.model";
import OrderRepositoryInterface from "../../domain/repository/order-repository.interface";
import OrderItem from "../../domain/entity/ordem-item";

export default class OrderRepository implements OrderRepositoryInterface{
  async create(entity: Order): Promise<void> {
    await OrderModel.create({
      id: entity.id,
      customerId: entity.customerId,
      total: entity.total(),
      items: entity.items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        productId: item.productId,
        quantity: item.quantity
      }))
    }, {
      include: [{
        model: OrderItemModel
      }]
    });
  }

  async update(entity: Order): Promise<void> { 
    const { items, ...order } = entity;

    await OrderModel.update({
      id: entity.id,
      customerId: entity.customerId,
      total: entity.total(),
    }, { where: { id: entity.id } });

    if (items && Array.isArray(items)) {
      for (const item of items) {
        const mappedItem = {
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          productId: item.productId,
          orderId: entity.id
        }
  
        await OrderItemModel.upsert(mappedItem);
      }
    }
  }

  async find(id: string): Promise<Order> { 
    const orderModel = await OrderModel.findOne({
      where: { id: id },
      include: ["items"]
    });
    const orderItems: OrderItem[] = orderModel.items.map((item) => new OrderItem(
      item.id, item.name, item.price, item.productId, item.quantity
    ));

    return new Order(orderModel.id, orderModel.customerId, orderItems);
  }

  async findAll(): Promise<Order[]> { 
    const orderModels = await OrderModel.findAll({
      include: ["items"]
    });

    return orderModels.map((orderModel) => { 
      const orderItems: OrderItem[] = orderModel.items.map((item) => new OrderItem(
        item.id, item.name, item.price, item.productId, item.quantity
      ));
      return new Order(orderModel.id, orderModel.customerId, orderItems);
    });
  } 
}