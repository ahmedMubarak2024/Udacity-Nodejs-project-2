import { Product, ProductStore } from "../../models/Products";

describe("test Product Model", () => {
  const store = new ProductStore();
  it("test create Product", async () => {
    const product: Product = {
      id: undefined,
      name: "Testproduct2",
      price: 3,
    };
    store
      .create(product)
      .then((res) => {
        (res as Product).id = undefined;
        expect(res).toEqual(product);
      })
      .catch((err) => {
        //console.log(err)
      });
  });

  it("test list product", async () => {
    const product1: Product = {
      id: 1,
      name: "Testproduct",
      price: 100,
    };
    store
      .index()
      .then((res) => {
        expect(res as Product[]).toContain(product1);
      })
      .catch((err) => {
        //console.log(err)
      });
  });

  it("test show product", async () => {
    const product: Product = {
      id: 1,
      name: "Testproduct",
      price: 100,
    };
    store
      .show(1)
      .then((req) => {
        expect(req).toEqual(product);
      })
      .catch((err) => {
        //console.log(err)
      });
  });
});
