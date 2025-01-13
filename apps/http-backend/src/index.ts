import express from "express";
import jwt from "jsonwebtoken";
import { middleware } from "./middleware";
import { JWT_SECRET } from "@repo/backend-common/config";
import {CreateUserSchema, SigninSchema, CreateRoomSchema} from "@repo/common/types";

const app = express();

app.post("/signup", (req, res) => {
 
  const data = CreateUserSchema.safeParse(req.body);
  if(!data.success){
   res.json({
      message: "Incorrect input"
    })
    return;
  }


  res.json({
    userId: 123
  })
});


app.post("/signin", middleware, async (req, res) => {
  const data = SigninSchema.safeParse(req.body);
  if(!data.success){
   res.json({
      message: "Incorrect input"
    })
    return;
  }
  const userId = 234324;

  const token = await jwt.sign({ userId }, JWT_SECRET);

  res.json({
    token,
  });
});


app.post("/room",middleware, (req, res) => {
  const data = CreateRoomSchema.safeParse(req.body);
  if(!data.success){
   res.json({
      message: "Incorrect input"
    })
    return;
  }

  res.json({
      roomId: 123
  });
});

app.listen(3004, () => {
  console.log("http-backend listening on port 3000");
});
