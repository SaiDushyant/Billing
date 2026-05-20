import Papa from "papaparse";

import * as XLSX from "xlsx";

export async function parseImportFile(buffer: Buffer, fileName?: string) {
  const lowerFileName = fileName?.toLowerCase() || "";

  // CSV FILE
  if (lowerFileName.endsWith(".csv")) {
    const csvText = buffer.toString("utf-8");

    const parsed = Papa.parse(csvText, {
      header: true,

      skipEmptyLines: true,
    });

    return parsed.data;
  }

  // EXCEL FILE
  const workbook = XLSX.read(buffer, {
    type: "buffer",
  });

  const sheetName = workbook.SheetNames[0];

  const worksheet = workbook.Sheets[sheetName];

  return XLSX.utils.sheet_to_json(worksheet);
}
