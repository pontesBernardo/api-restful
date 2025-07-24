import express from "express";
import dotenv from "dotenv";
import userRouter from "./routes/user.routes.js";

dotenv.config();

import { authMiddleware } from "./auth.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Home, publica");
});

app.use("/user", userRouter);

app.listen(3000, () => {
  try {
    console.log("Server are running on port 3000");
  } catch (err) {
    console.log(err);
  }
});
