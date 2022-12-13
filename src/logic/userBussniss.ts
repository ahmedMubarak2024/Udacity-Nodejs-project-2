import { UserIdentity, UserIdentityStore } from "../models/UserIdentity";
import isMail from "isemail";

const userIdentityStore = new UserIdentityStore();
export const saveUser = async (
  user: UserIdentity
): Promise<Array<string> | UserIdentity> => {
  const errors: Array<string> = [];
  if (user.firstName == undefined) {
    errors.push("User must have first name");
  }
  if (user.lastName == undefined) {
    errors.push("User must have last name");
  }
  if (user.email == undefined) {
    errors.push("User must have email name");
  } else if (!isMail.validate(user.email)) {
    errors.push("User must have a valid email");
  }
  if (user.password == undefined) {
    errors.push("User must have password");
  }
  if (errors.length == 0) {
    try {
      const reUser = await userIdentityStore.create(user);
      if (reUser instanceof Error) {
        errors.push(reUser.message);
      } else return reUser as UserIdentity;
    } catch (err) {
      console.error(err);
      errors.push("500 Server Error");
    }
  }
  return errors;
};
