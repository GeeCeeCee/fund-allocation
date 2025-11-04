import FundManager from "../services/allocation";
import { DepositPlan, PlanTypes } from "../types/allocation.types";

describe("FundManager - Core Allocation Logic", () => {
  let fundManager: ReturnType<typeof FundManager>;

  beforeEach(() => {
    fundManager = FundManager();
  });

  it("should return empty allocations if all weightages are zero", () => {
    const depositPlans: DepositPlan[] = [
      {
        type: PlanTypes.ONE_TIME,
        allocations: [
          { portfolioName: "GROWTH", amount: 0 },
          { portfolioName: "SAFE", amount: 0 },
        ],
      },
    ];
    const result = fundManager.allocateFunds(depositPlans, [1000]);

    expect(result.fundAllocation).toEqual({});
    expect(result.fundLedger).toEqual({});
  });

  it("should correctly allocate when ONE_TIME deposit equals its weightage", () => {
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
          { portfolioName: "BALANCED", amount: 600 },
          { portfolioName: "LOW_RISK", amount: 400 },
        ],
      },
    ];

    const deposits = [1000, 2000];
    const result = fundManager.allocateFunds(depositPlans, deposits);

    expect(result.fundLedger[PlanTypes.ONE_TIME]).toBeGreaterThanOrEqual(1);
    expect(result.fundLedger[PlanTypes.MONTHLY]).toBeGreaterThan(0);

    expect(result.fundAllocation["HIGH_RISK"]).toBeGreaterThan(0);
    expect(result.fundAllocation["RETIREMENT"]).toBeGreaterThan(0);
  });

  it("should handle partial (non-exact) deposit allocations", () => {
    const depositPlans: DepositPlan[] = [
      {
        type: PlanTypes.MONTHLY,
        allocations: [
          { portfolioName: "PORT_A", amount: 400 },
          { portfolioName: "PORT_B", amount: 600 },
        ],
      },
    ];

    const deposits = [500]; // smaller than total 1000
    const result = fundManager.allocateFunds(depositPlans, deposits);

    const total = Object.values(result.fundAllocation).reduce(
      (a, b) => a + b,
      0
    );
    expect(total).toBeCloseTo(500, 1);
  });

  it("should alternate plan types when fund > weightage", () => {
    const depositPlans: DepositPlan[] = [
      {
        type: PlanTypes.ONE_TIME,
        allocations: [{ portfolioName: "A", amount: 500 }],
      },
      {
        type: PlanTypes.MONTHLY,
        allocations: [{ portfolioName: "B", amount: 500 }],
      },
    ];

    const deposits = [2000];
    const result = fundManager.allocateFunds(depositPlans, deposits);

    // Should distribute across both plan types
    expect(result.fundLedger[PlanTypes.ONE_TIME]).toBeDefined();
    expect(result.fundLedger[PlanTypes.MONTHLY]).toBeDefined();
  });

  it("should gracefully handle empty deposit array", () => {
    const depositPlans: DepositPlan[] = [
      {
        type: PlanTypes.ONE_TIME,
        allocations: [{ portfolioName: "PORT_X", amount: 100 }],
      },
    ];

    const result = fundManager.allocateFunds(depositPlans, []);
    expect(result.fundAllocation).toEqual({});
    expect(result.fundLedger).toEqual({});
  });

  it("should maintain rounding precision to two decimals", () => {
    const depositPlans: DepositPlan[] = [
      {
        type: PlanTypes.MONTHLY,
        allocations: [
          { portfolioName: "P1", amount: 333.33 },
          { portfolioName: "P2", amount: 666.67 },
        ],
      },
    ];

    const deposits = [1000];
    const result = fundManager.allocateFunds(depositPlans, deposits);

    const total = result.fundAllocation["P1"] + result.fundAllocation["P2"];
    expect(total).toBeCloseTo(1000, 2);
  });

  it("should handle large deposits without overflow or errors", () => {
    const depositPlans: DepositPlan[] = [
      {
        type: PlanTypes.MONTHLY,
        allocations: [
          { portfolioName: "BIG", amount: 1000 },
          { portfolioName: "SAFE", amount: 1000 },
        ],
      },
    ];

    const deposits = [1_000_000];
    const result = fundManager.allocateFunds(depositPlans, deposits);

    expect(result.fundAllocation["BIG"]).toBeGreaterThan(0);
    expect(result.fundAllocation["SAFE"]).toBeGreaterThan(0);
  });

  it("should handle missing allocations gracefully", () => {
    const depositPlans: DepositPlan[] = [
      {
        type: PlanTypes.MONTHLY,
        allocations: [],
      },
    ];

    const deposits = [500];
    const result = fundManager.allocateFunds(depositPlans, deposits);
    expect(result.fundAllocation).toEqual({});
  });
});
