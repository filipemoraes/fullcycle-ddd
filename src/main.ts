import EventDispatcher from "./domain/@shared/event/event-dispatcher";
import OrderItem from "./domain/checkout/entity/ordem-item";
import Order from "./domain/checkout/entity/order";
import Customer from "./domain/customer/entity/customer";
import Address from "./domain/customer/value-object/address";

// Customer aggregate
// Relação via ID com o Order aggregate, pois são diferentes agregados
const customer = new Customer("123", "Filipe Moraes");
const address = new Address("Rua dois", 2, "1234-234", "Lisboa");

customer.setEventDispatcher(new EventDispatcher())
customer.address = address;

// Order aggregate
// Relação via objecto porque estão no mesmo agregado
const item1 = new OrderItem("1", "Item 1", 10, "p1", 2);
const item2 = new OrderItem("2", "Item 2", 10, "p1", 2);
const order = new Order("1", "123", [item1, item2]);