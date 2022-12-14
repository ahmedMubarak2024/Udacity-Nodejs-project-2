import express, { Request, Response } from "express";
import { ErrorStatus } from "../models/ErrorModel";
import { verifyAuthToken, handleError } from "../util";
import { Product, ProductStore } from "../models/Products";

const store = new ProductStore();

const show = async (req: Request, res: Response) => {
  try {
    const rsAwait = await store.show(Number(req.path.split("/").pop()));
    if (rsAwait instanceof ErrorStatus) {
      res.status(rsAwait.status).json(rsAwait.message);
      return;
    }
    res.status(200).json(rsAwait);
  } catch (err) {
    handleError(res, err);
  }
};

const create = async (req: Request, res: Response) => {
  const product: Product = {
    name: req.body.name,
    price: req.body.price,
  };
  try {
    const rsAwait = await store.create(product);
    if (rsAwait instanceof ErrorStatus) {
      res.status(rsAwait.status).json(rsAwait.message);
      return;
    }
    res.status(200).json(rsAwait);
  } catch (err) {
    handleError(res, err);
  }
};

const index = async (req: Request, res: Response) => {
  try {
    const rsAwait = await store.index();
    if (rsAwait instanceof ErrorStatus) {
      res.status(rsAwait.status).json(rsAwait.message);
      return;
    }
    res.status(200).json(rsAwait);
  } catch (err) {
    handleError(res, err);
  }
};

const userIdentityRoutes = (app: express.Application) => {
  app.get("/product", index);
  app.get("/product/:id", show);
  app.post("/product", verifyAuthToken, create);
};

export default userIdentityRoutes;
