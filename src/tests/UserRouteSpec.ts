import supertest from "supertest";

import { app } from "../server";

const request = supertest(app);

describe("test User Routes", () => {
  it("Test login Api", () => {
    const payload = {email: 'admin@local.com', password: 'testpassword' };
    request.post("/login").send(payload).set('Content-Type', 'application/json')
    .set('Accept', 'application/json').then((req) => {
        expect(req.body).toBeTrue()
      expect(req.status).toBe(200);
    });
  });

  it("Test login Api failure", () => {
    const payload = {email: 'admin@local.com', password: '' };
    request.post("/login").send(payload).set('Content-Type', 'application/json')
    .set('Accept', 'application/json').then((req) => {
        expect(req.body).toBe("User name or Password incorrect")
      expect(req.status).toBe(403);
    });
  });
});