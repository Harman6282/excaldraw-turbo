import express from "express";
import jwt from "jsonwebtoken";
import { middleware } from "./middleware";
import { JWT_SECRET } from "@repo/backend-common/config";
import {
  CreateUserSchema,
  SigninSchema,
  CreateRoomSchema,
} from "@repo/common/types";
import { prismaClient } from "@repo/db/client";

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  const parsedData = CreateUserSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.json({
      message: "Incorrect input",
    });
    return;
  }

  try {
    // todo hash the password using bcrypt
    const user = await prismaClient.user.create({
      data: {
        name: parsedData.data?.name,
        email: parsedData.data.username,
        password: parsedData.data.password,
      },
    });

    res.json({
      userId: user.id,
    });
  } catch (error) {
    res.status(400).json({ message: "User already exists with this username" });
  }

  res.json({
    userId: 123,
  });
});

app.post("/signin", async (req, res) => {
  const data = SigninSchema.safeParse(req.body);
  if (!data.success) {
    res.json({
      message: "Incorrect input",
    });
    return;
  }

  // todo compare the password using bcrypt

  const user = await prismaClient.user.findUnique({
    where: {
      email: data.data.username,
      password: data.data.password,
    },
  });

  const token = await jwt.sign({ userId: user?.id }, JWT_SECRET);
  if (!user) {
    res.status(400).json({ message: "Not authorized" });
    return;
  }

  res.json({
    token,
  });
});

app.post("/room", middleware, async (req, res) => {
  const parsedData = CreateRoomSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.json({
      message: "Incorrect input",
    });
    return;
  }

  const userId = req.userId;

  if (!parsedData.data.name || !userId) {
    res.json({
      message: "Incorrect input",
    });
    return;
  }

  try {
    const room = await prismaClient.room.create({
      data: {
        slug: parsedData.data.name,
        adminId: userId,
      },
    });

    res.json({
      roomId: room.id,
    });
  } catch (error) {
    res.json({
      message: "Room already exists",
    });
  }
});


app.get("/chats/:roomId", async (req, res) => {
  const roomId = Number(req.params.roomId);
  const messages = await prismaClient.chat.findMany({
    where:{
      roomId: roomId
    },
    orderBy:{
      id: "desc"
    },
    take: 50
  })

  res.json({messages})

})


app.listen(3007, () => {
  console.log("http-backend listening on port 3004");
});
