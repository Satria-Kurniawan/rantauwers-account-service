/** @type {import("express").RequestHandler} */

const jwt = require("jsonwebtoken");
const Account = require("../models/accountModel");

const withAuth = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.account = await Account.findById(decoded.accountId).select(
        "-password"
      );

      next();
    } catch (error) {
      res.status(401);
      console.log(error);
      return next(new Error("Unauthorized!"));
    }
  }

  if (!token) {
    res.status(401);
    return next(new Error("Unauthorized, no token!"));
  }
};

module.exports = { withAuth };
