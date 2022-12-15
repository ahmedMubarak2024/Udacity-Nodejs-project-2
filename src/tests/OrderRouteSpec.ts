import supertest from "supertest";

import { app } from "../server";
import { Order } from "../models/OrderModel";

const request = supertest(app);
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGxvY2FsLmNvbSIsImlkIjoxLCJpYXQiOjE2NzA3OTExODV9.fj99tZjCVf3dMJO6YqR5GlEptXvB1jjNCrJzE5nWy4I";

describe("test order Routes", () => {
  it("Test get or create current user order", () => {
    request
      .post("/orders")
      .set("authorization", token)
      .then((req) => {
        //console.log(req.body);
        const body = req.body as Order;
        body.id = undefined;
        body.products = undefined;
        expect(body).toEqual({
          id: undefined,
          status: "active",
          user_id: "1",
          products: undefined,
        });
        expect(req.status).toBe(200);
      })
      .catch((err) => {
        //console.error(err);
      });
  });
});
