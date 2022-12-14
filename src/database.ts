import { Pool } from "pg";
import {
  POSTGRES_DB,
  POSTGRES_HOST,
  POSTGRES_PASSWORD,
  POSTGRES_USER,
  ENV,
} from "./util";

export const client = new Pool({
  max: 100,
  min: 10,
  host: POSTGRES_HOST,
  database: POSTGRES_DB,
  user: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
});

//console.log(ENV + " " + POSTGRES_DB);
