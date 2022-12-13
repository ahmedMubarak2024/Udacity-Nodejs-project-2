import supertest from "supertest";

import { app } from "../server";

const request = supertest(app);
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGxvY2FsLmNvbSIsImlkIjoxLCJpYXQiOjE2NzA3OTExODV9.fj99tZjCVf3dMJO6YqR5GlEptXvB1jjNCrJzE5nWy4I";

describe("test Products Routes", () => {
  it("Test get All Products", () => {
    request.get("/product").then((req) => {
      expect(req.body).toEqual([
        {
          id: 1,
          name: "Testproduct",
          price: 100,
        },
      ]);
      expect(req.status).toBe(200);
    });
  });

  it("Test show products", () => {
    request.get("/product/1").then((req) => {
      expect(req.body).toEqual({
        id: 1,
        name: "Testproduct",
        price: 100,
      });
      expect(req.status).toBe(200);
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
        expect(req.body).toEqual({
          id: 2,
          name: "Product From PostMan 4",
          price: 12,
        });
        expect(req.status).toBe(200);
      });
  });
});
