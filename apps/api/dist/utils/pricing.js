"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateSellingPrice = calculateSellingPrice;
function calculateSellingPrice(costPrice, profitMargin) {
    return costPrice + (costPrice * profitMargin) / 100;
}
