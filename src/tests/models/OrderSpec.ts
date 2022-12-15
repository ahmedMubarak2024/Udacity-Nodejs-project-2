import {
  OrderStore,
  Order,
  OrderProduct,
  tableName,
} from "../../models/OrderModel";
import { client } from "../../database";
describe("test order Model", () => {
  const store = new OrderStore();
  it("Test add Product will work even if there is no Order row created", async () => {
    // const con =await client.connect()
    // await con.query("TRUNCATE "+ tableName+" CASCADE")
    // await con.query("TRUNCATE "+ "order_products"+" ")
    // con.release()
    store
      .addProduct(1, 2, 1)
      .then((res) => {
        console.log(res);
        (res as OrderProduct).order_id = undefined;
        (res as OrderProduct).id = undefined;
        expect(res).toEqual({
          id: undefined,
          quantity: 2,
          order_id: undefined,
          product_id: "1",
        });
      })
      .catch((err) => {
        //console.log(err)
      });
  });

  it("Test create Order will create order", async () => {
    const order: Order = {
      id: undefined,
      status: "active",
      user_id: "1",
    };
    store
      .createOrderOrGetCurrentOrder(1)
      .then((res) => {
        (res as Order).id = undefined;
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
        const re = (res as Order[])[0];
        re.id = undefined;
        re.products = undefined;
        const order: Order = {
          id: undefined,
          status: "active",
          user_id: "1",
          products: undefined,
        };
        expect(re).toEqual(order);
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
        const re = res as Order;
        re.id = undefined;
        re.products = undefined;
        expect(res).toEqual({
          id: undefined,
          status: "active",
          user_id: "1",
          products: undefined,
        });
      })
      .catch((err) => {
        //console.log(err)
      });
  });
});
