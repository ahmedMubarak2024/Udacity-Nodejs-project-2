import supertest from "supertest";
import { UserIdentity } from "../models/UserIdentity";
import { app } from "../server";
import { exec } from "child_process";

const request = supertest(app);
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGxvY2FsLmNvbSIsImZpcnN0TmFtZSI6InRlc3QiLCJpZCI6MSwiaWF0IjoxNjcxMDQyNDk3fQ.-U5E3UT_1PP6E8OmSnz7vXvubmvSlGuAVAtqYGwk5Es";
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
      })
      .catch((err) => {
        //console.error(err);
      });
  });

  it("test Get all Users", () => {
    request
      .get("/user")
      .set("authorization", token)

      .then((req) => {
        expect(req.status).toBe(200);
      })
      .catch((err) => {
        //console.error(err);
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
          first_name: "test",
          last_name: "User",
        };

        expect(req.body).toEqual(user);
        expect(req.status).toBe(200);
      })
      .catch((err) => {
        //console.error(err);
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
      })
      .catch((err) => {
        //console.error(err);
      });
  });
});
