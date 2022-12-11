import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { saveUser } from "../logic/userBussniss";
dotenv.config();

const { JWT_SECRET } = process.env;

import { UserIdentity, UserIdentityStore } from "../models/UserIdentity";

const store = new UserIdentityStore();

const index = async (_req: Request, res: Response) => {
  console.log("index ");
  const articles = await store.index();
  console.log(articles);

  res.json(articles);
};

const show = async (req: Request, res: Response) => {
  const user = await store.show(Number(req.path.split("/").pop()));
  user.password = undefined;
  res.json(user);
};
const create = async (req: Request, res: Response) => {
  try {
    let user: UserIdentity = {
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: req.body.password,
    };
    const userRes = await saveUser(user);

    if (userRes instanceof Array) {
      res.status(401).json(userRes);
    } else {
      console.log(userRes);
      user = userRes as UserIdentity;
      res.json(
        jwt.sign(
          { email: user.email, firstName: user.firstName },
          process.env.JWT_SECRET as string
        )
      );
    }
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};
const login = async (req: Request, res: Response) => {
  const user = await store.auth(req.body.email, req.body.password);
  if (user != null)
    res.json(
      jwt.sign(
        { email: user.email, firstName: user.firstName },
        JWT_SECRET as string
      )
    );
  else {
    res.status(401).json("Invalid Data");
  }
};

const destroy = async (req: Request, res: Response) => {
  const deleted = await store.delete(Number(req.path.split("/").pop()));
  res.json(deleted);
};
//here we are passing app from main server
const userIdentityRoutes = (app: express.Application) => {
  app.get("/user", verifyAuthToken, index);
  app.get("/user/:id", verifyAuthToken, show);
  app.post("/user", verifyAuthToken, create);
  app.delete("/user", verifyAuthToken, destroy);
  app.post("/login", login);
};

const verifyAuthToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("verifyAuthToken ");
    const authorizationHeader = req.headers.authorization as string;
    // console.log("verifyAuthToken authorizationHeader "+authorizationHeader)
    const token = authorizationHeader.split(" ")[1];
    // console.log("verifyAuthToken token "+token)
    jwt.verify(token, JWT_SECRET as string);
    //  console.log("authorization headers" + authorizationHeader + ":token " + token + ":decoded " + decoded)
    //res.status(200)
    next();
  } catch (error) {
    console.log(error);

    res.status(401).json("bad token");
  }
};
export default userIdentityRoutes;
