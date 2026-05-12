"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateGSTAmount = calculateGSTAmount;
function calculateGSTAmount(amount, gstRate) {
    return (amount * gstRate) / 100;
}
