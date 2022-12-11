import { client } from "../database";

import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

const { BCRYPT_PASSWORD, SALT_ROUNDS } = process.env;

export type UserIdentity = {
  id?: number;
  email?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
};
const tableName = "user_table";

export class UserIdentityStore {
  async index(): Promise<UserIdentity[]> {
    try {
      const connection = await client.connect();
      const result = await connection.query("SELECT * FROM user_table");
      connection.release();
      return result.rows;
    } catch (err) {
      throw new Error("Could not connect to database " + err);
    }
  }

  async show(id: number): Promise<UserIdentity> {
    try {
      const connection = await client.connect();
      const result = await connection.query(
        "SELECT * FROM " + tableName + " WHERE id = " + id
      );
      connection.release();
      return result.rows[0];
    } catch (err) {
      throw new Error("Could not connect to database " + err);
    }
  }

  async create(user: UserIdentity): Promise<UserIdentity | Error> {
    try {
      if (user.firstName == null || user.password == null) {
        throw new Error("bad Data");
      }

      const connection = await client.connect();

      const hash = bcrypt.hashSync(
        user.password + BCRYPT_PASSWORD,
        parseInt(SALT_ROUNDS as string)
      );
      console.log("Password before " + user.password + " has been " + hash);
      user.password = hash.toString();
      const sql =
        "INSERT INTO " +
        tableName +
        " (email, first_name ,last_name , password ) VALUES ($1 , $2,$3,$4)   RETURNING *";
      console.log(sql);
      const result = await connection.query(sql, [
        user.email,
        user.firstName,
        user.lastName,
        user.password,
      ]);

      connection.release();
      console.log(result);
      return result.rows[0];
    } catch (err) {
      if (err instanceof Error)
        if (err.message.includes("")) {
          return new Error("Email is Used Before ");
        }
      return new Error("500 Server Error");
    }
  }

  async delete(id: number): Promise<UserIdentity> {
    try {
      const connection = await client.connect();
      const result = await connection.query(
        "DELETE FROM " + tableName + " WHERE id = " + id + "  RETURNING *"
      );
      connection.release();
      return result.rows[0];
    } catch (err) {
      throw new Error("Could not connect to database " + err);
    }
  }

  async auth(email: string, password: string): Promise<UserIdentity | null> {
    try {
      const connection = await client.connect();
      const result = await connection.query(
        "SELECT * FROM " + tableName + " WHERE email =$1 ",
        [email]
      );
      connection.release();
      console.log(email + " " + password);
      if (result.rowCount > 0) {
        const user = result.rows[0];
        //console.log(password+BCRYPT_PASSWORD +" "+user.password)
        if (bcrypt.compareSync(password + BCRYPT_PASSWORD, user.password))
          return user;
        else return null;
      } else return null;
    } catch (err) {
      throw new Error("Could not connect to database " + err);
    }
  }
}

new UserIdentityStore().index().then((result: UserIdentity[]) => {
  console.log(result);
});
// new UserIdentityStore().create({name:"new User", password:"TestPasswordChange"})
