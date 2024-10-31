// AGGREGATE: Order

import OrderItem from "./ordem-item";

export default class Order { 
  private _id: string;
  private _customerId: string; // diferente agregado, a relação é por ID
  private _items: OrderItem[] = []; // mesmo agragado, a relação é pelo mesma classe
  private _total: number;
  
  constructor(id: string, customerId: string, items: OrderItem[]) {
    this._id = id;
    this._customerId = customerId;
    this._items = items;
    this._total = this.total();
    this.validate();
  }

  get id() {
    return this._id;
  }

  get customerId() {
    return this._customerId;
  }
  
  get items() {
    return this._items;
  }

  changeItems(items: OrderItem[]) { 
    this._items = items;
    this._total = this.total();
  }

  validate() { 
    if (this._id.length === 0) { 
      throw new Error("Id is required");
    }
  }

  total(): number {
    return this._items.reduce((acc, item) => acc + item.orderItemTotal(), 0);
  }
}