import fs from "fs";

import Papa from "papaparse";

import XLSX from "xlsx";

export async function parseImportFile(filePath: string) {
  if (filePath.endsWith(".csv")) {
    const file = fs.readFileSync(filePath, "utf-8");

    const parsed = Papa.parse(file, {
      header: true,

      skipEmptyLines: true,
    });

    return parsed.data;
  }

  const workbook = XLSX.readFile(filePath);

  const sheetName = workbook.SheetNames[0];

  const worksheet = workbook.Sheets[sheetName];

  return XLSX.utils.sheet_to_json(worksheet);
}
