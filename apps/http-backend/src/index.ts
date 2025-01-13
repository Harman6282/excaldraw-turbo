import express from "express";
import jwt from "jsonwebtoken";
import { middleware } from "./middleware";
import { JWT_SECRET } from "./config";

const app = express();

app.post("/signup", (req, res) => {
  res.send("signup route");

  res.json({
    userId: 123
  })
});


app.post("/signin", middleware, async (req, res) => {
  res.send("signin route");

  const userId = 234324;

  const token = await jwt.sign({ userId }, JWT_SECRET);

  res.json({
    token,
  });
});


app.post("/room",middleware, (req, res) => {
  res.json({
      roomId: 123
  });
});

app.listen(3004, () => {
  console.log("http-backend listening on port 3000");
});
