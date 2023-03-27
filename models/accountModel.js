const mongoose = require("mongoose");

const accountSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Mohon masukan nama!"],
    },
    email: {
      type: String,
      required: [true, "Mohon masukan email!"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Mohon masukan password!"],
    },
    phone: {
      type: String,
      default: null,
    },
    avatar: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Account", accountSchema);
