import { Allocation, DepositPlan, PlanTypes } from "../types/allocation.types";

const FundManager = () => {
  const fundAllocation: { [key: string]: number } = {};
  const depositPlanMap: { [key: string]: Allocation[] } = {};
  const fundLedger: { [key: string]: number } = {};
  const allocateFunds = (depositPlan: DepositPlan[], deposits: number[]) => {
    const depositWeights: { [key: string]: number } = {};

    depositPlan.forEach((plan) => {
      depositPlanMap[plan.type] = [...plan.allocations].sort(
        (a, b) => a.amount - b.amount
      );
      depositWeights[plan.type] = plan.allocations.reduce(
        (acc, curr) => acc + curr.amount,
        0
      );
    });

    deposits.forEach((deposit) => {
      if (
        depositWeights[PlanTypes.ONE_TIME] != null &&
        depositWeights[PlanTypes.ONE_TIME] === deposit &&
        fundLedger[PlanTypes.ONE_TIME] == null
      ) {
        fundLedger[PlanTypes.ONE_TIME] = 1;
        addToPortfolio(
          depositPlanMap[PlanTypes.ONE_TIME],
          deposit,
          depositWeights[PlanTypes.ONE_TIME]
        );
        return;
      }

      fundLedger[PlanTypes.MONTHLY] == null
        ? (fundLedger[PlanTypes.MONTHLY] = 1)
        : fundLedger[PlanTypes.MONTHLY]++;
      addToPortfolio(
        depositPlanMap[PlanTypes.MONTHLY],
        deposit,
        depositWeights[PlanTypes.MONTHLY]
      );
    });

    console.info("Fund Allocations");
    console.table(fundAllocation);

    console.info("Fund Ledger");
    console.table(fundLedger);

    return { fundAllocation, fundLedger };
  };

  const addToPortfolio = (
    allocations: Allocation[],
    fund: number,
    weightage: number
  ) => {
    if (fund <= 0 && allocations == null && Array.isArray(allocations)) return;
    let index = 0;
    for (const allocation of allocations) {
      const proportionateFund = (allocation.amount / weightage) * fund;
      fundAllocation[allocation.portfolioName] == null
        ? (fundAllocation[allocation.portfolioName] = proportionateFund)
        : (fundAllocation[allocation.portfolioName] += proportionateFund);
    }
  };

  return {
    allocateFunds,
  };
};

export default FundManager;
