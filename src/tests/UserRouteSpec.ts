import supertest from "supertest";
import { UserIdentity } from "../models/UserIdentity";

import { app } from "../server";

const request = supertest(app);
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGxvY2FsLmNvbSIsImlkIjoxLCJpYXQiOjE2NzA3OTExODV9.fj99tZjCVf3dMJO6YqR5GlEptXvB1jjNCrJzE5nWy4I";
describe("test User Routes", () => {
  it("Test login Api", () => {
    const payload = { email: "admin@local.com", password: "testpassword" };
    request
      .post("/login")
      .send(payload)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .then((req) => {
        expect(req.body).toBeTruthy();
        expect(req.status).toBe(200);
      });
  });

  it("Test login Api failure", () => {
    const payload = { email: "admin@local.com", password: "" };
    request
      .post("/login")
      .send(payload)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .then((req) => {
        expect(req.body).toBe("User name or Password incorrect");
        expect(req.status).toBe(403);
      });
  });

  it("test Get all Users", () => {
    request
      .get("/user")
      .set("authorization", token)
      .then((req) => {
        expect(req.body).toEqual([
          {
            id: 1,
            email: "admin@local.com",
            first_name: "test",
            last_name: "User",
            password:
              "$2b$10$tIdk.GsndSRMyzyOSGrge.IJZq6BhK4ZjAZ61F2OOZSkFGdsXCt5y",
          },
        ]);
        expect(req.status).toBe(200);
      });
  });

  it("show user test", () => {
    request
      .get("/user/1")
      .set("authorization", token)
      .then((req) => {
        const user: UserIdentity = {
          id: 1,
          email: "admin@local.com",
          firstName: "test",
          lastName: "User",
          password:
            "$2b$10$tIdk.GsndSRMyzyOSGrge.IJZq6BhK4ZjAZ61F2OOZSkFGdsXCt5y",
        };

        expect(req.body).toEqual(user);
        expect(req.status).toBe(200);
      });
  });

  it("create user test", () => {
    const payload = {
      firstName: "user3",
      lastName: "user3",
      email: "user3@local.com",
      password: "testpassword",
    };
    request
      .post("/user")
      .send(payload)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .then((req) => {
        // console.log(req.body);
        expect(req.status).toBe(200);
      });
  });
});
