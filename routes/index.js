import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicRootConfig = {
  root: path.join(__dirname, "../public"),
};
router.get("/", (req, res) => {
  if(!req.session.user){
    res.redirect("/login")
  }
  res.sendFile("index.html", publicRootConfig);
});
router.get("/login", (req, res) => {
  if(req.session.user){
    res.redirect("/")
  }
  res.sendFile("login.html", publicRootConfig);
});
router.get("/register", (req, res) => {
  if(req.session.user){
    res.redirect("/")
  }
  res.sendFile("register.html", publicRootConfig);
});

export { router as webPages };

