const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Account = require("../models/accountModel");

const generateToken = (accountId) => {
  return jwt.sign({ accountId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

const signUp = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Mohon lengkapi data!" });
  }

  const userExists = await Account.findOne({ email });

  if (userExists) {
    return res
      .status(400)
      .json({ message: `Akun dengan email ${email} telah ada!` });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const account = await Account.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Registrasi akun berhasil.",
      account: {
        _id: account._id,
        name: account.name,
        email: account.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Registrasi akun gagal." });
  }
};

const signIn = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Mohon lengkapi data!" });
  }

  const account = await Account.findOne({ email });

  if (account && (await bcrypt.compare(password, account.password))) {
    res.json({
      message: "Login berhasil.",
      account: {
        _id: account._id,
        name: account.name,
        email: account.email,
        avatar: account.avatar,
        role: account.role,
        token: generateToken(account._id),
      },
    });
  } else {
    res.status(400).json({ message: "Email atau password salah!." });
  }
};

const getMe = async (req, res) => {
  res.json(req.account);
};

module.exports = { signUp, signIn, getMe };
