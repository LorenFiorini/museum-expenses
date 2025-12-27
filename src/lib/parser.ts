import * as XLSX from "xlsx";
import { ExpenseEntry, GiftEntry, ParsedPayload } from "../types";

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

export type ParsedResult =
  | { ok: true; data: ParsedPayload; warnings: string[] }
  | { ok: false; error: string };

export function parseWorkbook(files: File[]): Promise<ParsedResult> {
  return new Promise((resolve) => {
    const readers = files.map(
      (file) =>
        new Promise<ArrayBuffer>((res, rej) => {
          const reader = new FileReader();
          reader.onload = () => res(reader.result as ArrayBuffer);
          reader.onerror = () => rej(reader.error);
          reader.readAsArrayBuffer(file);
        })
    );

    Promise.all(readers)
      .then((buffers) => {
        const payload: ParsedPayload = { expenses: [], gifts: [] };
        const warnings: string[] = [];

        buffers.forEach((buf, idx) => {
          const file = files[idx];
          const workbook = XLSX.read(buf, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const rows: Record<string, unknown>[] = XLSX.utils.sheet_to_json(
            workbook.Sheets[sheetName],
            { defval: "" }
          );

          if (looksLikeExpenses(rows)) {
            payload.expenses = normalizeExpenses(rows);
          } else if (looksLikeGifts(rows)) {
            payload.gifts = normalizeGifts(rows);
          } else {
            warnings.push(`Could not recognize schema for file: ${file.name}`);
          }
        });

        if (!payload.expenses.length && !payload.gifts.length) {
          resolve({ ok: false, error: "No recognized data found in uploads." });
          return;
        }

        resolve({ ok: true, data: payload, warnings });
      })
      .catch((error) => {
        resolve({ ok: false, error: (error as Error).message });
      });
  });
}

function looksLikeExpenses(rows: Record<string, unknown>[]) {
  const cols = new Set(Object.keys(rows[0] ?? {}));
  return expenseColumns.every((c) => cols.has(c));
}

function looksLikeGifts(rows: Record<string, unknown>[]) {
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






