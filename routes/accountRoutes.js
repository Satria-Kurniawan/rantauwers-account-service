const express = require("express");
const router = express.Router();

const { signUp, signIn, getMe } = require("../controllers/accountController");
const { withAuth } = require("../middlewares/withAuth");

router.post("/sign-up", signUp);
router.post("/sign-in", signIn);
router.get("/me", withAuth, getMe);

module.exports = router;
