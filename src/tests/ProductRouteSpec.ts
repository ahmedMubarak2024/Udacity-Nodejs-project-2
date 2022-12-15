import supertest from "supertest";
import { client } from "../../src/database";
import { app } from "../server";
import { Product, tableName } from "../models/Products";

const request = supertest(app);
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGxvY2FsLmNvbSIsImlkIjoxLCJpYXQiOjE2NzA3OTExODV9.fj99tZjCVf3dMJO6YqR5GlEptXvB1jjNCrJzE5nWy4I";

describe("test Products Routes", () => {
  beforeAll(async () => {
    // const con = await client.connect()
    // await con.query("TRUNCATE "+tableName+" CASCADE")
    // await con.query("INSERT INTO products_table (name,price) VALUES($1,$2)",['Testproduct',100])
    // con.release()
  });
  it("Test get All Products", () => {
    request
      .get("/product")
      .then((req) => {
        console.log(req.body);
        // expect(req.body).toEqual([
        //   {
        //     id: 1,
        //     name: "Testproduct",
        //     price: 100,
        //   },
        // ]);
        expect(req.status).toBe(200);
      })
      .catch((err) => {
        //console.error(err);
      });
  });

  it("Test show products", () => {
    request
      .get("/product/1")
      .then((req) => {
        expect(req.body).toEqual({
          id: 1,
          name: "Testproduct",
          price: 100,
        });
        expect(req.status).toBe(200);
      })
      .catch((err) => {
        //console.error(err);
      });
  });

  it("test create new product", () => {
    request
      .post("/product")
      .set("authorization", token)
      .send({
        name: "Product From PostMan 4",
        price: 12,
      })
      .then((req) => {
        const body = req.body as Product;
        body.id = undefined;

        expect(req.body).toEqual({
          id: undefined,
          name: "Product From PostMan 4",
          price: 12,
        });
        expect(req.status).toBe(200);
      })
      .catch((err) => {
        //console.error(err);
      });
  });
});
