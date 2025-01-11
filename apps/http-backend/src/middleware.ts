import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export function middleware(req: Request, res: Response) {
  const token = req.headers["authorization"] ?? "";

  const decoded = jwt.verify(token, "secret");

  if (decoded) {
    // @ts-ignore
    req.userid = decoded.userid;

  } else {
    res.status(401).send({
      message: "Unauthorized",
    });
  }
}
