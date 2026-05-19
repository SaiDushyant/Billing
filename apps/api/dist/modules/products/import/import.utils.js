"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseImportFile = parseImportFile;
const fs_1 = __importDefault(require("fs"));
const papaparse_1 = __importDefault(require("papaparse"));
const xlsx_1 = __importDefault(require("xlsx"));
async function parseImportFile(filePath) {
    if (filePath.endsWith(".csv")) {
        const file = fs_1.default.readFileSync(filePath, "utf-8");
        const parsed = papaparse_1.default.parse(file, {
            header: true,
            skipEmptyLines: true,
        });
        return parsed.data;
    }
    const workbook = xlsx_1.default.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    return xlsx_1.default.utils.sheet_to_json(worksheet);
}
