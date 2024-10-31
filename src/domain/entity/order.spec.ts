import Order from "./order";
import OrderItem from "./ordem-item";

describe("Order unit testes", () => { 
  it("should throw error when id is empty", () => { 
    expect(() => {
      const order = new Order("", "John", []);
    }).toThrow("Id is required");
  });

  it("should calculate total", () => { 
    const item1 = new OrderItem("i1", "Item 1", 100, "p1", 2);
    const item2 = new OrderItem("i2", "Item 2", 200, "p2", 2);
    const order = new Order("o1", "c1", [item1, item2]);
    const total = order.total();
      
    expect(total).toBe(600);
  });
});