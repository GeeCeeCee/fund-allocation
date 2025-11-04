export type PlanType = "ONE_TIME" | "MONTHLY";

export const PlanTypes = {
  ONE_TIME: "ONE_TIME",
  MONTHLY: "MONTHLY",
} as const;

export interface Portfolio {
  id: string;
  name: string;
  balance: number;
}

export interface Allocation {
  portfolioName: string;
  amount: number;
}

export interface DepositPlan {
  type: PlanType;
  allocations: Allocation[];
}
