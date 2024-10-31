// AGGREGATE: Customer

import Address from "./address";

export default class Customer { 
  private _id: string;
  private _name: string;
  private _active = false;
  private _address!: Address;
  private _rewardPoints: number = 0;

  constructor(id: string, name: string) { 
    this._id = id;
    this._name = name;
    this.validate();
  }

  get id() { return this._id; }

  get name() { return this._name; }
  set name(value: string) {
    this._name = value;
  }

  get address() { return this._address; }
  set address(address: Address) {
    this._address = address;
  }

  get rewardPoints(): number { 
    return this._rewardPoints;
  }

  // Esse metodo é muito mais do que um set, ele contém regra de negócio
  // Modelagem de dominio rico expressa o negócio
  changeName(name: string) { 
    // Regra de negócio
    // ...
    this._name = name;
    this.validate();
  }

  changeAddress(address: Address) {
    this._address = address;
  }

  validate() { 
    if (this._id.length === 0) { 
      throw new Error("Id is required");
    }

    if (this._name.length === 0) { 
      throw new Error("Name is required");
    }
  }

  activate() { 
    if (this._address === undefined) { 
      throw new Error("Address is mandatory to activate a customer");
    }

    this._active = true;
  }

  isActive() { 
    return this._active;
  }

  addRewardPoints(points: number) { 
    this._rewardPoints += points;
  }
}