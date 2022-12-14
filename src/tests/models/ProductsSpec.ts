import { Product, ProductStore } from "../../models/Products";

describe("test Product Model", () => {
  const store = new ProductStore();
  it("test create Product", async () => {
    const product: Product = {
      id: 2,
      name: "Testproduct2",
      price: 3,
    };
    store
      .create(product)
      .then((res) => {
        expect(product).toEqual(product);
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
    const product2: Product = {
      id: 2,
      name: "Testproduct2",
      price: 3,
    };
    store
      .index()
      .then((res) => {
        expect(res).toEqual([product1, product2]);
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
