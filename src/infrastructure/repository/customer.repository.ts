import Customer from "../../domain/entity/customer";
import Address from "../../domain/entity/address";
import CustomerRepositoryInterface from "../../domain/repository/customer-repository.interface";
import CustomerModel from "./../db/sequelize/model/customer.model";
import EventDispatcher from "../../domain/event/@shared/event-dispatcher";
import CustomerCreatedEvent from "../../domain/event/customer/customer-created.event";

export default class CustomerRepository implements CustomerRepositoryInterface {
  private eventDispatcher: EventDispatcher;

  constructor(eventDispatcher: EventDispatcher) { 
    this.eventDispatcher = eventDispatcher;
  }

  async create(entity: Customer): Promise<void> {
    const data = {
      id: entity.id,
      name: entity.name,
      street: entity.address.street,
      number: entity.address.number,
      zipcode: entity.address.zip,
      city: entity.address.city,
      active: entity.isActive(),
      rewardPoints: entity.rewardPoints,
    };

    await CustomerModel.create(data);

    const customerCreatedEvent = new CustomerCreatedEvent(data);
    this.eventDispatcher.notify(customerCreatedEvent);
  }

  async update(entity: Customer): Promise<void> {
    await CustomerModel.update(
      {
        name: entity.name,
        street: entity.address.street,
        number: entity.address.number,
        zipcode: entity.address.zip,
        city: entity.address.city,
        active: entity.isActive(),
        rewardPoints: entity.rewardPoints,
      },
      {
        where: {
          id: entity.id,
        },
      }
    );
  }

  async find(id: string): Promise<Customer> {
    let customerModel;
    try {
      customerModel = await CustomerModel.findOne({
        where: {
          id,
        },
        rejectOnEmpty: true,
      });
    } catch (error) {
      throw new Error("Customer not found");
    }

    const customer = new Customer(id, customerModel.name);
    customer.setEventDispatcher(this.eventDispatcher);

    const address = new Address(
      customerModel.street,
      customerModel.number,
      customerModel.zipcode,
      customerModel.city
    );
    customer.changeAddress(address);
    return customer;
  }

  async findAll(): Promise<Customer[]> {
    const customerModels = await CustomerModel.findAll();

    const customers = customerModels.map((customerModels) => {
      const customer = new Customer(customerModels.id, customerModels.name);
      customer.addRewardPoints(customerModels.rewardPoints);
      customer.setEventDispatcher(this.eventDispatcher);

      const address = new Address(
        customerModels.street,
        customerModels.number,
        customerModels.zipcode,
        customerModels.city
      );
      customer.changeAddress(address);

      if (customerModels.active) {
        customer.activate();
      }
      return customer;
    });

    return customers;
  }
}