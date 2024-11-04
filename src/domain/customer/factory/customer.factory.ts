import Customer from "../entity/customer";
import { v4 as uuid } from "uuid";
import Address from "../value-object/address";
import EventDispatcher from "../../@shared/event/event-dispatcher";

export default class CustomerFactory {
  public static create(name: string): Customer {
    const customer = new Customer(uuid(), name);
    customer.setEventDispatcher(new EventDispatcher());

    return customer;
  }

  public static createWithAddress(name: string, address: Address): Customer {
    const customer = new Customer(uuid(), name);
    customer.setEventDispatcher(new EventDispatcher());
    customer.changeAddress(address);

    return customer;
  }
}