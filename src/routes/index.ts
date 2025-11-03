import express, { Request, Response } from "express";
const router = express.Router();
import AllocationHandler from "../handlers/allocation.handler";

router.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server...");
});

router.post("/allocate", AllocationHandler.allocate);

export default router;
