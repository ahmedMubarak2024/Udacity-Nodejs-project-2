import { client } from "../database";
import { ErrorStatus } from "./ErrorModel";
import { Product } from "./Products";
import { tableName as productTable, ProductStore } from "./Products";
export type OrderProduct = {
  id?: number;
  quantity: number;
  order_id: string | undefined;
  product_id: string;
};

export type ProductOrderItem = Product & { quantity: number };
export type Order = {
  id?: number;
  user_id: string;
  status?: string;
  products?: Array<ProductOrderItem>;
};
export const tableName = "orders";
const manyToManyTable = "order_products";

export class OrderStore {
  async addProduct(
    productId: number,
    quantity: number,
    userId: number,
    orderId?: number
  ): Promise<OrderProduct | ErrorStatus> {
    try {
      const product = await new ProductStore().show(productId);
      //  console.log(product);
      if (product instanceof ErrorStatus) {
        return product;
      }

      if (orderId == null) {
        const createdOrder = await this.createOrderOrGetCurrentOrder(userId);
        if (createdOrder instanceof ErrorStatus) return createdOrder;
        orderId = createdOrder.id;
      }
      const sql =
        "INSERT INTO order_products (quantity, order_id, product_id) VALUES($1, $2, $3) RETURNING *";
      const conn = await client.connect();

      const result = await conn.query(sql, [quantity, orderId, productId]);

      const order = result.rows[0];

      conn.release();

      return order;
    } catch (err) {
      return new ErrorStatus(
        `Could not add product ${productId} to order ${orderId}: ${err}`,
        403
      );
    }
  }

  async getAllOrders(): Promise<Order[] | ErrorStatus> {
    const sqlListOrder = "SELECT * FROM " + tableName;
    try {
      const conn = await client.connect();
      const result = await conn.query(sqlListOrder);
      return result.rows;
    } catch (err) {
      return new ErrorStatus(`Could not list Order`, 500);
    }
  }

  async getUserOrders(userId: number): Promise<Order[] | ErrorStatus> {
    const sqlGetCurrentOrder =
      "SELECT * FROM " + tableName + " WHERE user_id = $1";
    try {
      const conn = await client.connect();
      const result = await conn.query(sqlGetCurrentOrder, [userId]);
      return result.rows;
    } catch (err) {
      return new ErrorStatus(`Could not Create new Order`, 500);
    }
  }

  async getCurrentUserOrder(
    userId: number
  ): Promise<Order | ErrorStatus | undefined> {
    const userOrders = await this.getUserOrders(userId);

    if (userOrders instanceof ErrorStatus) return userOrders;
    try {
      const currentOrder = userOrders.find((order: Order) => {
        return order.status == "active";
      });
      return currentOrder;
    } catch (err) {
      return new ErrorStatus(`Could not get Current Order`, 500);
    }
  }

  async getOrderById(orderId: number): Promise<Order | ErrorStatus> {
    try {
      /*
            SELECT i.id, i.relative_url, count(*) as number_of_tags_matched
FROM   images i
    join tags_image_relations ti on i.id = ti.image_id
    join tags t on t.id = ti.tag_id
    where t.name in ('google','microsoft','apple')
            */
      const sqlOrder = "SELECT * FROM " + tableName + " WHERE id = $1";
      const sqlGetOrderProducts =
        "SELECT p.name,p.price,p.id,op.quantity FROM " +
        productTable +
        " p " +
        "JOIN " +
        manyToManyTable +
        " op ON p.id = op.product_id " +
        "JOIN " +
        tableName +
        " o ON o.id = op.order_id " +
        "WHERE o.id=$1";
      const conn = await client.connect();

      const result = await conn.query(sqlOrder, [orderId]);
      if (result.rows.length == 0)
        return new ErrorStatus("orders not found " + orderId, 404);
      const order = result.rows[0];
      const orderProducts = await conn.query(sqlGetOrderProducts, [orderId]);
      if (orderProducts.rowCount > 0)
        (order as Order).products = orderProducts.rows;

      return order;
    } catch (err) {
      console.log(err);
      return new ErrorStatus(`Could not get Order Details`, 500);
    }
  }

  async createOrderOrGetCurrentOrder(
    userId: number
  ): Promise<Order | ErrorStatus> {
    const haveCurrentOrder = await this.getCurrentUserOrder(userId);
    if (haveCurrentOrder != undefined) return haveCurrentOrder;
    try {
      const sqlCreateNewOrder =
        "INSERT INTO " + tableName + "(user_id) values ($1) RETURNING *";

      const conn = await client.connect();

      const result = await conn.query(sqlCreateNewOrder, [userId]);

      return result.rows[0];
    } catch (err) {
      return new ErrorStatus(`Could not Create new Order`, 500);
    }
  }
}
