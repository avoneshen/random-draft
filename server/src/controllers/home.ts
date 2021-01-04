import { Request, Response } from "express";

export default function index(req: Request, res: Response): void {
  res.sendFile("index.html");
}
