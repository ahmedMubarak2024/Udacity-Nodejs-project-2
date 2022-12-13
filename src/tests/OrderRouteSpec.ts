import supertest from "supertest";

import { app } from "../server";

const request = supertest(app);
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGxvY2FsLmNvbSIsImlkIjoxLCJpYXQiOjE2NzA3OTExODV9.fj99tZjCVf3dMJO6YqR5GlEptXvB1jjNCrJzE5nWy4I";

describe("test order Routes", () => {
  it("Test get or create current user order", () => {
    request
      .post("/orders")
      .set("authorization", token)
      .then((req) => {
        expect(req.body).toEqual({
          id: 1,
          status: "active",
          user_id: "1",
        });
        expect(req.status).toBe(200);
      });
  });
});
