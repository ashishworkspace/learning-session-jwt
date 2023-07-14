import express from "express";
import { authRouter } from "./routes/auth.js";
import "dotenv/config.js";
import RedisStore from "connect-redis";
import session from "express-session";
import { createClient } from "redis";
import { webPages } from "./routes/index.js";
import { fileURLToPath } from "url";
import path from "path";
import cookieParser from "cookie-parser";
import { mongoConnect } from "./dbConnect.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.join(__filename, "../public");

// Initialize client.
const redisClient = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: "redis-16826.c301.ap-south-1-1.ec2.cloud.redislabs.com",
    port: 16826,
  },
});
redisClient.connect().catch(console.error);

// Initialize store.
const redisStore = new RedisStore({
  client: redisClient,
  prefix: "myapp:",
});

// Initialize sesssion storage.
app.use(
  session({
    store: redisStore,
    resave: false, // required: force lightweight session keep alive (touch)
    saveUninitialized: false, // recommended: only save session when data exists
    secret: process.env.SECRET_SESSION,
    cookie: {
      secure: false,
      httpOnly: false,
      maxAge: 1000 * 60 * 10,
    },
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// app.use("/hello", (req, res) => {
//   if (req.session.viewCount === undefined) {
//     req.session.viewCount = 0;
//   } else {
//     req.session.viewCount += 1;
//   }
//   res.status(200).json({ viewCount: req.session.viewCount });
// });

app.use("/", webPages);
app.use("/api", authRouter);

app.use(express.static(path.join(__dirname, "../public")));

const start = async () => {
  try {
    const mongo = await mongoConnect();
  } catch (err) {
    console.log(err);
  }

  app.listen(process.env.PORT, () => {
    console.log(`Listen on port: ${process.env.PORT}`);
  });
};

start();
