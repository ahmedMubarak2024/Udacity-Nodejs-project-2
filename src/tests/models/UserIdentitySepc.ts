import { UserIdentity, UserIdentityStore } from "../../models/UserIdentity";

describe("test User Model", () => {
  const store = new UserIdentityStore();
  it("test create User", async () => {
    const user: UserIdentity = {
      id: 2,
      first_name: "Test User2",
      last_name: "test",
      password: "Test Password",
      email: "email@test.com",
    };
    store
      .create(user)
      .then((result) => {
        expect(result).toEqual(user);
      })
      .catch((err) => {
        // console.log(err)
      });
  });

  it("test list User", async () => {
    store
      .index()
      .then((result) => {
        expect(result).toEqual([]);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  it("test show User", async () => {
    store
      .show(1)
      .then((result) => {
        expect(result).toEqual({
          id: 1,
          email: "admin@local.com",
          first_name: "test",
          last_name: "User",
          password:
            "$2b$10$tIdk.GsndSRMyzyOSGrge.IJZq6BhK4ZjAZ61F2OOZSkFGdsXCt5y",
        });
      })
      .catch((err) => {
        // console.log(err)
      });
  });
});
