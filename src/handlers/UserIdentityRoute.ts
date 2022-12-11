import express, { Request, Response } from "express";
import { ErrorStatus } from "../models/ErrorModel";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { saveUser } from "../logic/userBussniss";
import { verifyAuthToken } from "../util";
dotenv.config();

const { JWT_SECRET } = process.env;

import { UserIdentity, UserIdentityStore } from "../models/UserIdentity";

const store = new UserIdentityStore();

// const index = async (_req: Request, res: Response) => {
//   console.log("index ");
//   const articles = await store.index();
//   console.log(articles);

//   res.json(articles);
// };

const show = async (req: Request, res: Response) => {
  const rsAwait = await store.show(Number(req.path.split("/").pop()));
  if (rsAwait instanceof ErrorStatus) {
    res.status(rsAwait.status).json(rsAwait.message);
  }
  (rsAwait as UserIdentity).password = undefined;
  res.json(rsAwait);
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
  if (user instanceof ErrorStatus) {
    user as ErrorStatus;
    console.log("ErrorState " + user.message + " " + user.status);
    res.status(user.status).json(user.message);
  } else {
    res.json(
      jwt.sign(
        { email: user.email, firstName: user.firstName, id: user.id },
        JWT_SECRET as string
      )
    );
    console.log(user);
  }
};

const destroy = async (req: Request, res: Response) => {
  const deleted = await store.delete(Number(req.path.split("/").pop()));
  if (deleted instanceof ErrorStatus) {
    deleted as ErrorStatus;
    res.status(deleted.status).json(deleted.message);
  } else {
    res.status(200).json(deleted);
  }
};
//here we are passing app from main server
const userIdentityRoutes = (app: express.Application) => {
  app.get("/user", verifyAuthToken, index);
  app.get("/user/:id", verifyAuthToken, show);
  app.post("/user", verifyAuthToken, create);
  app.delete("/user", verifyAuthToken, destroy);
  app.post("/login", login);
};

export async function index(req: Request, res: Response) {
  const Response = await store.index();
  if (Response instanceof ErrorStatus) {
    Response as ErrorStatus;
    res.status(Response.status).json(Response.message);
  } else {
    res.status(200).json(Response);
  }
}

export default userIdentityRoutes;
