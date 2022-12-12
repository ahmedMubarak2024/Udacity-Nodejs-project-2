import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
// const parseCliFlagValue = (flagName:string) => {
//   const flag = process.argv.find(argument => argument.indexOf(`-${flagName}=`) > -1);

//   if (flag) {
//       return flag.slice(flag.indexOf('=') + 1);
//   }

//   return undefined;
// };

// const envFile = '.env' +parseCliFlagValue('env')
const file =
  ".env" +
  (process.env.NODE_ENV != undefined ? "." + process.env.NODE_ENV : "");
console.log(file);
dotenv.config({ path: file.trim() });

console.log(process.env.NODE_ENV);
export const {
  POSTGRES_HOST,
  POSTGRES_DB,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  ENV,
  BCRYPT_PASSWORD,
  SALT_ROUNDS,
  JWT_SECRET,
  NODE_ENV,
} = process.env;
console.log(process.env.POSTGRES_USER);
import { Request, Response, NextFunction } from "express";

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
