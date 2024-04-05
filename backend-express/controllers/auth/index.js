import login from "./login.js";
import signup from "./signup.js";
import verify from "./verify.js";
import signout from "./signout.js";

export default {
  "/login": login,
  "/signup": signup,
  "/verify": verify,
  "/signout": signout,
};
