import * as XLSX from "xlsx";

const expenseColumns = [
  "Name",
  "Dates",
  "Destination",
  "Purpose",
  "Air",
  "Rail",
  "Taxi/Car",
  "Subsistence",
  "Other (including Hospitality given)",
  "Total"
];

const giftColumns = [
  "Name",
  "Financial Year",
  "Enter your Job title",
  "Are you submitting a nil return?",
  "Organisation/ person providing gift or hospitality",
  "Accepted\xa0or declined",
  "Date",
  "Type of hospitality or gift",
  "Estimated value of gift £",
  "Relationship between the organisation / person and Museum?",
  "Business reason for acceptance?",
  "Enter any other comments here"
];

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

export type ParsedResult =
  | { ok: true; data: ParsedPayload; warnings: string[]; fileType: "expenses" | "gifts" }
  | { ok: false; error: string };

export function parseWorkbook(buffer: Buffer, filename: string): ParsedResult {
  try {
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const rows: Record<string, unknown>[] = XLSX.utils.sheet_to_json(
      workbook.Sheets[sheetName],
      { defval: "" }
    );

    if (rows.length === 0) {
      return { ok: false, error: `File ${filename} appears to be empty.` };
    }

    if (looksLikeExpenses(rows)) {
      return {
        ok: true,
        data: { expenses: normalizeExpenses(rows), gifts: [] },
        warnings: [],
        fileType: "expenses"
      };
    } else if (looksLikeGifts(rows)) {
      return {
        ok: true,
        data: { expenses: [], gifts: normalizeGifts(rows) },
        warnings: [],
        fileType: "gifts"
      };
    } else {
      return { ok: false, error: `Could not recognize schema for file: ${filename}` };
    }
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }
}

function looksLikeExpenses(rows: Record<string, unknown>[]) {
  if (rows.length === 0) return false;
  const cols = new Set(Object.keys(rows[0] ?? {}));
  return expenseColumns.every((c) => cols.has(c));
}

function looksLikeGifts(rows: Record<string, unknown>[]) {
  if (rows.length === 0) return false;
  const cols = new Set(Object.keys(rows[0] ?? {}));
  return giftColumns.every((c) => cols.has(c));
}

function num(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function normalizeExpenses(rows: Record<string, unknown>[]): ExpenseEntry[] {
  return rows.map((row) => ({
    name: String(row["Name"] ?? "").trim(),
    dates: String(row["Dates"] ?? "").trim(),
    destination: String(row["Destination"] ?? "").trim(),
    purpose: String(row["Purpose"] ?? "").trim(),
    air: num(row["Air"]),
    rail: num(row["Rail"]),
    taxiCar: num(row["Taxi/Car"]),
    subsistence: num(row["Subsistence"]),
    other: num(row["Other (including Hospitality given)"]),
    total: num(row["Total"])
  }));
}

function normalizeGifts(rows: Record<string, unknown>[]): GiftEntry[] {
  return rows.map((row) => ({
    name: String(row["Name"] ?? "").trim(),
    financialYear: String(row["Financial Year"] ?? "").trim(),
    jobTitle: String(row["Enter your Job title"] ?? "").trim(),
    nilReturn: String(row["Are you submitting a nil return?"] ?? "").trim(),
    organisation: String(
      row["Organisation/ person providing gift or hospitality"] ?? ""
    ).trim(),
    accepted: String(row["Accepted\xa0or declined"] ?? "").trim(),
    date: String(row["Date"] ?? "").trim(),
    type: String(row["Type of hospitality or gift"] ?? "").trim(),
    estimatedValue: num(row["Estimated value of gift £"]),
    relationship: String(
      row["Relationship between the organisation / person and Museum?"] ?? ""
    ).trim(),
    businessReason: String(row["Business reason for acceptance?"] ?? "").trim(),
    comments: String(row["Enter any other comments here"] ?? "").trim()
  }));
}

