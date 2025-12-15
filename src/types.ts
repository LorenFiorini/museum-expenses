export type ExpenseEntry = {
  name: string;
  dates: string;
  destination: string;
  purpose: string;
  air: number;
  rail: number;
  taxiCar: number;
  subsistence: number;
  other: number;
  total: number;
};

export type GiftEntry = {
  name: string;
  financialYear: string;
  jobTitle: string;
  nilReturn: string;
  organisation: string;
  accepted: string;
  date: string;
  type: string;
  estimatedValue: number;
  relationship: string;
  businessReason: string;
  comments: string;
};

export type ParsedPayload = {
  expenses: ExpenseEntry[];
  gifts: GiftEntry[];
};

export type TrendPoint = { label: string; value: number };

export type BreakdownSlice = { label: string; value: number };

