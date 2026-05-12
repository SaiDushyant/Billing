"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSKU = generateSKU;
function generateSKU(parts) {
    return parts
        .map((part) => part.trim().toUpperCase().replace(/\s+/g, "-"))
        .join("-");
}
