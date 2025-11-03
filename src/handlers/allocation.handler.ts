import { Request, Response } from "express";
import FundManager from "../utility/allocation";

const AllocationHandler = {
  allocate: async function (req: Request, res: Response) {
    const {
      body: { depositPlans, deposits },
    } = req;
    try {
      const fundManager = FundManager();
      const allocation = fundManager.allocateFunds(depositPlans, deposits);
      res.send(allocation);
    } catch (error) {
      console.error("Error processing allocation:", error);
      res.status(500).send("Internal Server Error");
      return;
    }
    res.send("This is an example route.");
  },
};

export default AllocationHandler;
