import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);
  const existingUser = await User.findOne({
    username,
  });
  if (existingUser) {
    res.status(400).send("User Already exist!");
  } else {
    const newUser = new User({
      username,
      password,
    }).save();
    const user = (await newUser).toJSON();

    req.session.user = user;
    delete user.password;
    console.log(user);
    res.status(200).send({ user });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const userInfo = {
    username,
    password,
  };

  const user = await userInfo;
  const existingUser = await User.findOne({ username });
  if (!existingUser) {
    res.status(400).send("User not found");
  } else if (
    !(await existingUser.toComparePassword(existingUser.password, password))
  ) {
    res.status(400).send("Password is incorrect!");
  } else {
    const user = existingUser.toJSON();
    req.session.user = user;
    delete user.password;
    res.status(200).send({
      user,
    });
  }
});

export { router as authRouter };
