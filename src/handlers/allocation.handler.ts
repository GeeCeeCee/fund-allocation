import { Request, Response } from "express";
import FundManager from "../services/allocation";
import Ajv from "ajv";
import { schema } from "../utilities/schema/allocation";

const AllocationHandler = {
  allocate: async function (req: Request, res: Response) {
    const {
      body: { depositPlans, deposits },
    } = req;
    try {
      const ajv = new Ajv({ allErrors: true });
      const validate = ajv.compile(schema);

      const valid = validate(req.body);

      if (!valid) {
        res.status(400).json({
          success: false,
          errors: validate!.errors!.map((err) => ({
            field: err.instancePath || err.params.missingProperty,
            message: err.message,
          })),
        });
        return;
      }
      const fundManager = FundManager();
      const allocation = fundManager.allocateFunds(depositPlans, deposits);
      res.send(allocation);
    } catch (error) {
      console.error("Error processing allocation:", error);
      res.status(500).send("Internal Server Error");
      return;
    }
  },
};

export default AllocationHandler;
