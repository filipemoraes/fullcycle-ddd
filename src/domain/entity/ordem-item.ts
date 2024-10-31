// AGGREGATE: Order

export default class OrderItem { 
  private _id: string;
  private _name: string;
  private _price: number;
  private _quantity: number;
  private _productId: string;

  constructor(id: string, name: string, price: number, productId: string, quantity: number) { 
    this._id = id;
    this._name = name;
    this._price = price;
    this._quantity = quantity;
    this._productId = productId;
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get quantity() { 
    return this._quantity;
  }

  get price() {
    return this._price;
  }

  get productId() { 
    return this._productId;
  }

  orderItemTotal(): number {
    return this._price * this._quantity;
  }
}