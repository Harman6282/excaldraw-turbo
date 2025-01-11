import express from "express";
import jwt from "jsonwebtoken";
import { middleware } from "./middleware";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello from http-backend");
});

app.post("/signin", middleware , async (req, res) => {
  res.send("signin route");

  const userid = 234324;

  const token = await jwt.sign({ userid }, "secret");

  res.json({
    token,
  });
});

app.post("/signup", (req, res) => {
  res.send("signup route");
});

app.post("/create-room", (req, res) => {
  res.send("create room route");
});

app.listen(3004, () => {
  console.log("http-backend listening on port 3000");
});
