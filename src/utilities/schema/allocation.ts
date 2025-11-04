export const schema = {
  type: "object",
  required: ["depositPlans", "deposits"],
  properties: {
    depositPlans: {
      type: "array",
      minItems: 1,
      maxItems: 2,
      items: {
        type: "object",
        required: ["type", "allocations"],
        properties: {
          type: {
            type: "string",
            enum: ["ONE_TIME", "MONTHLY", "QUARTERLY", "YEARLY"],
          },
          allocations: {
            type: "array",
            minItems: 1,
            items: {
              type: "object",
              required: ["portfolioName", "amount"],
              properties: {
                portfolioName: { type: "string", minLength: 1 },
                amount: {
                  type: "number",
                  minimum: 1,
                },
              },
              additionalProperties: false,
            },
          },
        },
        additionalProperties: false,
      },
    },
    deposits: {
      type: "array",
      minItems: 1,
      items: { type: "number", minimum: 0 },
    },
  },
  additionalProperties: false,
};
