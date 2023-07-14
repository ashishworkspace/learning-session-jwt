import express from "express";

const router = express.Router();

const tempDB = [];

router.post("/register", (req, res) => {
  const { userName, password } = req.body;

  const userInfo = {
    userName,
    password,
  };
  console.log(userInfo)
  const existingUser = tempDB.find((user) => user.userName === userName);
  if (!existingUser) {
    tempDB.push(userInfo);
    req.session.user = userInfo;
    res.status(200).send(userInfo);
  } else {
    res.status(400).send("User Already exist!");
  }
});

router.post("/login", (req, res) => {
  const { userName, password } = req.body;

  const userInfo = {
    userName,
    password,
  };
  const existingUser = tempDB.find((user) => user.userName === userName);
  if (!existingUser) {
    res.status(400).send("User not found");
    // tempDB.push(userInfo)
    // req.session.userInfo = userInfo
    // res.status(200).send(userInfo)
  } else if (existingUser.password !== password) {
    res.status(400).send("Password is incorrect!");
  } else {
    req.session.user = userInfo;
    res.status(200).send({
      user: userInfo,
    });
  }
});

export { router as authRouter };
