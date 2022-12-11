import express, { Request, Response } from "express";
import { ErrorStatus } from "../models/ErrorModel";
import { verifyAuthToken } from "../util";
import { Order, OrderProduct, OrderStore } from "../models/OrderModel";
import { UserIdentity, UserIdentityStore } from "../models/UserIdentity";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const { JWT_SECRET } = process.env;

const store = new OrderStore();

const show = async (req: Request, res: Response) => {
  const rsAwait = await store.getOrderById(Number(req.path.split("/").pop()));
  if (rsAwait instanceof ErrorStatus) {
    res.status(rsAwait.status).json(rsAwait.message);
    return;
  }
  res.status(200).json(rsAwait);
};

const create = async (req: Request, res: Response) => {
  console.log("createProducts");
  const user = await getUserFromToken(req.headers.authorization as string);

  const rsAwait = await store.createOrderOrGetCurrentOrder(user.id as number);
  if (rsAwait instanceof ErrorStatus) {
    res.status(rsAwait.status).json(rsAwait.message);
    return;
  }
  if (req.body.product != undefined) {
    addProducts(req, res);
    return;
  }
  res.status(200).json(rsAwait);
};

const index = async (req: Request, res: Response) => {
  const rsAwait = await store.getAllOrders();
  if (rsAwait instanceof ErrorStatus) {
    res.status(rsAwait.status).json(rsAwait.message);
    return;
  }
  res.status(200).json(rsAwait);
};

const addProducts = async (req: Request, res: Response) => {
  console.log("addProducts");

  const user = await getUserFromToken(req.headers.authorization as string);
  const productId = req.body.product;
  const quantity = req.body.quantity;
  const addproductRes = await store.addProduct(
    productId,
    quantity,
    user.id as number
  );

  if (addproductRes instanceof ErrorStatus) {
    res.status(addproductRes.status).json(addproductRes.message);
    return;
  }
  res.status(200).json(addproductRes);
};

const OrderRoutes = (app: express.Application) => {
  app.get("/orders", verifyAuthToken, index);
  app.get("/orders/:id", verifyAuthToken, show);
  app.post("/orders", verifyAuthToken, create);
  app.post("/orders/:id", verifyAuthToken, addProducts);
  //app.post("/orders/:id", verifyAuthToken, addToOrder);
};

async function getUserFromToken(token: string): Promise<UserIdentity> {
  const payload = jwt.verify(token, JWT_SECRET as string) as jwt.JwtPayload;
  payload.id;
  return (await new UserIdentityStore().show(payload.id)) as UserIdentity;
}

export default OrderRoutes;
