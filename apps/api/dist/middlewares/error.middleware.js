"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = errorMiddleware;
function errorMiddleware(error, _, res, __) {
    console.error(error);
    return res.status(500).json({
        message: error.message || "Internal server error",
    });
}
