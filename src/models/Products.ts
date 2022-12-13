import { client } from "../database";
import { ErrorStatus } from "./ErrorModel";
export type Product = {
  id?: number;
  name: string;
  price: number;
};
export const tableName = "products_table";

export class ProductStore {
  async index(): Promise<Product[] | ErrorStatus> {
    try {
      const connection = await client.connect();
      const result = await connection.query("SELECT * FROM " + tableName);
      connection.release();
      return result.rows;
    } catch (err) {
      console.error(err);
      return new ErrorStatus("500 Server Error Could not list products", 500);
    }
  }

  async show(id: number): Promise<Product | ErrorStatus> {
    try {
      const connection = await client.connect();
      const result = await connection.query(
        "SELECT * FROM " + tableName + " WHERE id = " + id
      );
      connection.release();
      if (result.rows.length == 0)
        return new ErrorStatus("Product not Found", 404);
      return result.rows[0];
    } catch (err) {
      console.error(err);
      return new ErrorStatus("500 Server Error Could check for product", 500);
    }
  }

  async create(user: Product): Promise<Product | ErrorStatus> {
    try {
      const connection = await client.connect();
      const sql =
        "INSERT INTO " +
        tableName +
        " (name, price ) VALUES ($1 , $2)   RETURNING *";
      //console.log(sql);
      const result = await connection.query(sql, [user.name, user.price]);

      connection.release();
      //console.log(result);
      return result.rows[0];
    } catch (err) {
      return new ErrorStatus("500 Server Error", 500);
    }
  }
}
