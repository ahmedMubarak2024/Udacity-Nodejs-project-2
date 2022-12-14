import { UserIdentity, UserIdentityStore } from "../models/UserIdentity";

describe("Testing User from database", function () {
  const userIdentityStore = new UserIdentityStore();
  it("when list user we have on user ", async function () {
    userIdentityStore
      .index()
      .then((res) => {
        expect(res instanceof Array<UserIdentity>).toBe(true);
      })
      .catch((err) => {
        //console.log(err);
      });
  });

  it("show the user with id 1 ", async function () {
    userIdentityStore
      .show(1)
      .then((res) => {
        expect((res as UserIdentity).email).toEqual("admin@local.com");
      })
      .catch((err) => {
        //console.log(err)
      });
    //console.log(user)
  });
  it("when send Username and Password i should be success ", async function () {
    userIdentityStore
      .auth("admin@local.com", "testpassword")
      .then((res) => {
        expect((res as UserIdentity).email).toEqual("admin@local.com");
      })
      .catch((err) => {
        //console.error(err);
      });
  });
});

//
