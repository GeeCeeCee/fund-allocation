import {
  Allocation,
  DepositPlan,
  PlanType,
  PlanTypes,
} from "../types/allocation.types";

const FundManager = () => {
  const fundAllocation: { [key: string]: number } = {};
  const depositPlanMap: { [key: string]: Allocation[] } = {};
  const fundLedger: { [key: string]: number } = {};
  const depositWeights: { [key: string]: number } = {};

  const allocateFunds = (depositPlan: DepositPlan[], deposits: number[]) => {
    let fundConsumptionIndex = 0;
    depositPlan.forEach((plan) => {
      depositPlanMap[plan.type] = [...plan.allocations];
      const weightage = plan.allocations.reduce(
        (acc, curr) => acc + curr.amount,
        0
      );
      depositWeights[plan.type] = weightage;
      fundConsumptionIndex += weightage;
    });

    if (fundConsumptionIndex <= 0) {
      return { fundAllocation, fundLedger };
    }

    deposits.forEach((deposit) => {
      if (
        depositWeights[PlanTypes.ONE_TIME] != null &&
        depositWeights[PlanTypes.ONE_TIME] === deposit &&
        fundLedger[PlanTypes.ONE_TIME] == null
      ) {
        addToPortfolio(PlanTypes.ONE_TIME, deposit);
        return;
      }

      addToPortfolio(PlanTypes.MONTHLY, deposit);
    });

    console.info("Fund Allocations");
    console.table(fundAllocation);

    console.info("Fund Ledger");
    console.table(fundLedger);

    return { fundAllocation, fundLedger };
  };

  const addToPortfolio = (planType: PlanType, fund: number) => {
    const allocationDetails = {
      planType,
      fund,
    };
    while (allocationDetails.fund > 0) {
      if (depositPlanMap[allocationDetails.planType] != null) {
        const weightage = depositWeights[allocationDetails.planType];
        const allocationAmount = Math.min(weightage, fund);
        allocationDetails.fund -= weightage;
        const planDetails = depositPlanMap[allocationDetails.planType];
        planDetails.forEach((allocation: Allocation) => {
          const proportionateFund =
            Math.round(
              (allocation.amount / weightage) * allocationAmount * 100
            ) / 100;
          fundAllocation[allocation.portfolioName] == null
            ? (fundAllocation[allocation.portfolioName] = proportionateFund)
            : (fundAllocation[allocation.portfolioName] += proportionateFund);
        });

        fundLedger[allocationDetails.planType] == null
          ? (fundLedger[allocationDetails.planType] = 1)
          : fundLedger[allocationDetails.planType]++;
      }

      allocationDetails.planType =
        allocationDetails.planType === PlanTypes.MONTHLY
          ? PlanTypes.ONE_TIME
          : PlanTypes.MONTHLY;
    }
  };

  return {
    allocateFunds,
  };
};

export default FundManager;
