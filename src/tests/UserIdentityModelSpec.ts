import{ UserIdentity, UserIdentityStore} from "../models/UserIdentity"
describe("Testing User from database", function () {
    const userIdentityStore = new UserIdentityStore()
    it("when list user we have on user ", async function () {
            expect((await userIdentityStore.index() as Array<UserIdentity>).length).toBe(1)
          });

          it("show the user with id 1 ", async function () {
            expect((await userIdentityStore.show(1) as UserIdentity).email).toBe("admin@local.com")
          });    
          it("when send Username and Password i should be success ", async function () {
           expect( (await userIdentityStore.auth("admin@local.com","testpassword")as UserIdentity).email).toBe("admin@local.com")
          })  

})

// 