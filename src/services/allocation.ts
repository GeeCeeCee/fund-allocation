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
        addToPortfolio(depositPlanMap[PlanTypes.ONE_TIME], deposit);
        return;
      }

      fundLedger[PlanTypes.MONTHLY] == null
        ? (fundLedger[PlanTypes.MONTHLY] = 1)
        : fundLedger[PlanTypes.MONTHLY]++;
      addToPortfolio(depositPlanMap[PlanTypes.MONTHLY], deposit);
    });

    console.info("Fund Allocations");
    console.table(fundAllocation);

    console.info("Fund Ledger");
    console.table(fundLedger);

    return { fundAllocation, fundLedger };
  };

  const addToPortfolio = (allocations: Allocation[], fund: number) => {
    if (fund <= 0 && allocations == null && Array.isArray(allocations)) return;
    let index = 0;
    while (fund > 0 && allocations.length > 0 && index < allocations.length) {
      const currentAllocation = allocations[index];
      fundAllocation[currentAllocation.portfolioName] == null
        ? (fundAllocation[currentAllocation.portfolioName] = Math.min(
            currentAllocation.amount,
            fund
          ))
        : (fundAllocation[currentAllocation.portfolioName] += Math.min(
            currentAllocation.amount,
            fund
          ));

      fund -= currentAllocation.amount;
      index++;

      if (fund > 0 && index === allocations.length) {
        index = 0;
      }
    }
  };

  return {
    allocateFunds,
  };
};

export default FundManager;
// default module.exports = FundManager;

// const depositPlans: DepositPlan[] = [
//   {
//     type: PlanTypes.ONE_TIME,
//     allocations: [
//       { portfolioName: "HIGH_RISK", amount: 700 },
//       { portfolioName: "RETIREMENT", amount: 300 },
//     ],
//   },
//   {
//     type: PlanTypes.MONTHLY,
//     allocations: [
//       { portfolioName: "HIGH_RISK", amount: 400 },
//       { portfolioName: "RETIREMENT", amount: 600 },
//     ],
//   },
// ];

// const deposits = [1000, 2000, 4000, 5000, 10];
// const fundManager = FundManager();
// const res = fundManager.allocateFunds(depositPlans, deposits);

// console.log(res);
