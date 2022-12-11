import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import { Request, Response, NextFunction } from "express";
const { JWT_SECRET } = process.env;

export const verifyAuthToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("verifyAuthToken ");
    const authorizationHeader = req.headers.authorization as string;
    // console.log("verifyAuthToken authorizationHeader "+authorizationHeader)
    const token = authorizationHeader;
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
