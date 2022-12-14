import { client } from "../database";
import { ErrorStatus } from "./ErrorModel";
import bcrypt from "bcrypt";
import { BCRYPT_PASSWORD, SALT_ROUNDS } from "../util";

export type UserIdentity = {
  id?: number;
  email?: string;
  first_name?: string;
  last_name?: string;
  password?: string;
};
export const tableName = "user_table";

export class UserIdentityStore {
  async index(): Promise<UserIdentity[] | ErrorStatus> {
    try {
      const connection = await client.connect();
      const result = await connection.query("SELECT * FROM " + tableName);
      connection.release();
      return result.rows;
    } catch (err) {
      console.error(err);

      return new ErrorStatus("500 Server Error Could not list users", 500);
    }
  }

  async show(id: number): Promise<UserIdentity | ErrorStatus> {
    try {
      const connection = await client.connect();
      const result = await connection.query(
        "SELECT * FROM " + tableName + " WHERE id = " + id
      );
      connection.release();
      if (result.rowCount == 0) {
        return new ErrorStatus("User Not Found", 404);
      }
      return result.rows[0];
    } catch (err) {
      return new ErrorStatus("500 Server Error Could Search for User", 500);
    }
  }

  async create(user: UserIdentity): Promise<UserIdentity | ErrorStatus> {
    try {
      if (user.first_name == null || user.password == null) {
        throw new Error("bad Data");
      }

      const connection = await client.connect();

      const hash = bcrypt.hashSync(
        user.password + BCRYPT_PASSWORD,
        parseInt(SALT_ROUNDS as string)
      );
      //console.log("Password before " + user.password + " has been " + hash);
      user.password = hash.toString();
      const sql =
        "INSERT INTO " +
        tableName +
        " (email, first_name ,last_name , password ) VALUES ($1 , $2,$3,$4)   RETURNING *";
      //console.log(sql);
      const result = await connection.query(sql, [
        user.email,
        user.first_name,
        user.last_name,
        user.password,
      ]);

      connection.release();
      //console.log(result);
      return result.rows[0];
    } catch (err) {
      if (err instanceof Error)
        if (err.message.includes("")) {
          return new ErrorStatus("Email is Used Before ", 400);
        }
      return new ErrorStatus("500 Server Error", 500);
    }
  }

  async delete(id: number): Promise<UserIdentity | ErrorStatus> {
    try {
      const connection = await client.connect();
      const result = await connection.query(
        "DELETE FROM " + tableName + " WHERE id = " + id + "  RETURNING *"
      );
      connection.release();
      if (result.rowCount == 0) {
        return new ErrorStatus("User Could Not be deleted", 500);
      }
      return result.rows[0];
    } catch (err) {
      return new ErrorStatus("500 Server Error unable to delete user", 500);
    }
  }

  async auth(
    email: string,
    password: string
  ): Promise<UserIdentity | ErrorStatus> {
    try {
      const connection = await client.connect();
      const result = await connection.query(
        "SELECT * FROM " + tableName + " WHERE email =$1 ",
        [email]
      );
      connection.release();
      //console.log(result.rows);
      if (result.rowCount > 0) {
        const user = result.rows[0];
        //console.log(password+BCRYPT_PASSWORD +" "+user.password)
        if (bcrypt.compareSync(password + BCRYPT_PASSWORD, user.password))
          return user;
        else return new ErrorStatus("User name or Password incorrect", 403);
      } else return new ErrorStatus("User name or Password incorrect", 403);
    } catch (err) {
      return new ErrorStatus("500 Server Error unable to Authenticate", 500);
    }
  }
}

new UserIdentityStore().index().then((result: UserIdentity[] | ErrorStatus) => {
  console.log(result);
});
// new UserIdentityStore().create({name:"new User", password:"TestPasswordChange"})
