import Address from '../value-object/address';
import Customer from './customer';

describe("Customer unit testes", () => { 
  it("should throw error when id is empty", () => { 
    expect(() => {
      const customer = new Customer("", "John");
    }).toThrow("Id is required");
  });

  it("should throw error when name is empty", () => { 
    expect(() => {
      const customer = new Customer("123", "");
    }).toThrow("Name is required");
  });

  it("should throw error when name is empty", () => { 
    // Arrange
    const customer = new Customer("123", "John");
    // Act
    customer.name = "Jane";
    // Assert
    expect(customer.name).toBe("Jane");
  });

  it("should activate customer", () => { 
    const customer = new Customer("123", "Customer 1");
    const address = new Address("123", 123, "1234-123", "Lisboa");
    
    customer.address = address;
    customer.activate();

    expect(customer.isActive()).toBe(true);
  });

  it("should add reward points", () => {
    const customer = new Customer("123", "Customer 1");
    expect(customer.rewardPoints).toBe(0);

    customer.addRewardPoints(10);
    expect(customer.rewardPoints).toBe(10);

    customer.addRewardPoints(10);
    expect(customer.rewardPoints).toBe(20);
  });
});