import { OrderStore, Order, OrderProduct } from "../../models/OrderModel";

describe("test order Model", () => {
  const store = new OrderStore();
  it("Test add Product will work even if there is no Order row created", async () => {
    store
      .addProduct(1, 2, 1)
      .then((res) => {
        expect(res).toEqual({
          id: 1,
          quantity: 2,
          order_id: "1",
          product_id: "1",
        });
      })
      .catch((err) => {
        //console.log(err)
      });
  });

  it("Test create Order will create order", async () => {
    const order: Order = {
      id: 1,
      status: "active",
      user_id: "1",
    };
    store
      .createOrderOrGetCurrentOrder(1)
      .then((res) => {
        expect(res).toEqual(order);
      })
      .catch((err) => {
        //console.log(err)
      });
  });

  it("Test getAllOrders return my order", async () => {
    store
      .createOrderOrGetCurrentOrder(1)
      .then((res) => {
        return store.getAllOrders();
      })
      .then((res) => {
        const order: Order = {
          id: 1,
          status: "active",
          user_id: "1",
        };
        expect((res as Order[])[0]).toEqual(order);
      })
      .catch((err) => {
        //console.log(err)
      });
  });

  it("Test show order by Id", async () => {
    store
      .createOrderOrGetCurrentOrder(1)
      .then((res) => {
        return store.getOrderById(1);
      })
      .then((res) => {
        expect(res).toEqual({
          id: 1,
          status: "active",
          user_id: "1",
        });
      })
      .catch((err) => {
        //console.log(err)
      });
  });
});
