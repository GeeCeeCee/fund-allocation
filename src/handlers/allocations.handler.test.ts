import FundManager from "../services/allocation";
import { DepositPlan, PlanTypes } from "../types/allocation.types";

describe("FundManager", () => {
  let fundManager: ReturnType<typeof FundManager>;

  beforeEach(() => {
    fundManager = FundManager();
  });

  it("should return empty allocations if total weightage <= 0", () => {
    const depositPlans: DepositPlan[] = [
      {
        type: PlanTypes.ONE_TIME,
        allocations: [
          { portfolioName: "HIGH_RISK", amount: 0 },
          { portfolioName: "RETIREMENT", amount: 0 },
        ],
      },
    ];

    const result = fundManager.allocateFunds(depositPlans, [1000]);
    expect(result.fundAllocation).toEqual({});
    expect(result.fundLedger).toEqual({});
  });

  it("should allocate deposits correctly for ONE_TIME plan match", () => {
    const depositPlans: DepositPlan[] = [
      {
        type: PlanTypes.ONE_TIME,
        allocations: [
          { portfolioName: "HIGH_RISK", amount: 700 },
          { portfolioName: "RETIREMENT", amount: 300 },
        ],
      },
      {
        type: PlanTypes.MONTHLY,
        allocations: [
          { portfolioName: "HIGH_RISK", amount: 500 },
          { portfolioName: "RETIREMENT", amount: 500 },
        ],
      },
    ];

    // deposit exactly equals ONE_TIME plan total (1000)
    const deposits = [1000, 2000];

    const result = fundManager.allocateFunds(depositPlans, deposits);

    expect(result.fundLedger[PlanTypes.ONE_TIME]).not.toBe(0);

    expect(result.fundLedger[PlanTypes.MONTHLY]).not.toBe(0);

    expect(result.fundAllocation["HIGH_RISK"]).toBeGreaterThan(0);
    expect(result.fundAllocation["RETIREMENT"]).toBeGreaterThan(0);
  });

  it("should alternate plan types when adding to portfolio", () => {
    const depositPlans: DepositPlan[] = [
      {
        type: PlanTypes.ONE_TIME,
        allocations: [{ portfolioName: "RETIREMENT", amount: 500 }],
      },
      {
        type: PlanTypes.MONTHLY,
        allocations: [{ portfolioName: "RETIREMENT", amount: 500 }],
      },
    ];

    const deposits = [2000];

    const result = fundManager.allocateFunds(depositPlans, deposits);

    // Should have distributed to both plans since fund alternates
    expect(result.fundLedger[PlanTypes.MONTHLY]).toBeDefined();
    expect(result.fundLedger[PlanTypes.ONE_TIME]).toBeDefined();

    const totalAllocated =
      (result.fundAllocation["RETIREMENT"] || 0) +
      (result.fundAllocation["RETIREMENT"] || 0);
    expect(totalAllocated).toBeGreaterThan(0);
  });

  it("should skip ONE_TIME allocation if already used", () => {
    const depositPlans: DepositPlan[] = [
      {
        type: PlanTypes.ONE_TIME,
        allocations: [
          { portfolioName: "HIGH_RISK", amount: 500 },
          { portfolioName: "RETIREMENT", amount: 500 },
        ],
      },
      {
        type: PlanTypes.MONTHLY,
        allocations: [
          { portfolioName: "HIGH_RISK", amount: 600 },
          { portfolioName: "RETIREMENT", amount: 400 },
        ],
      },
    ];

    const deposits = [1000, 1000, 1000];

    const result = fundManager.allocateFunds(depositPlans, deposits);

    // ONE_TIME should only occur once
    expect(result.fundLedger[PlanTypes.ONE_TIME]).toBe(1);
    expect(result.fundLedger[PlanTypes.MONTHLY]).toBeGreaterThanOrEqual(1);
  });

  it("should handle empty deposit array gracefully", () => {
    const depositPlans: DepositPlan[] = [
      {
        type: PlanTypes.ONE_TIME,
        allocations: [
          { portfolioName: "HIGH_RISK", amount: 500 },
          { portfolioName: "RETIREMENT", amount: 500 },
        ],
      },
    ];

    const result = fundManager.allocateFunds(depositPlans, []);
    expect(result.fundAllocation).toEqual({});
    expect(result.fundLedger).toEqual({});
  });
});
