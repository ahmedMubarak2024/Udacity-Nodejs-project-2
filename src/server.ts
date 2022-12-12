import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import userIdentityRoutes from "./handlers/UserIdentityRoute";
import productRoutes from "./handlers/ProductRoute";
import OrderRoute from "./handlers/OrderRoute";

export const app: express.Application = express();
const port = 8085;
const address = "127.0.0.1:" + port;

app.use(bodyParser.json());

app.get("/", function (req: Request, res: Response) {
  res.send("Hello World!");
});

app.listen(port, function () {
  console.log(`starting app on: ${address}`);
});

userIdentityRoutes(app);
productRoutes(app);
OrderRoute(app);
