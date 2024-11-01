import Customer from "./domain/entity/customer";
import Address from "./domain/entity/address";
import OrderItem from "./domain/entity/ordem-item";
import Order from "./domain/entity/order";
import EventDispatcher from "./domain/event/@shared/event-dispatcher";

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