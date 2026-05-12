"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsController = void 0;
const analytics_service_1 = require("./analytics.service");
class AnalyticsController {
    static async dashboard(_, res) {
        try {
            const analytics = await analytics_service_1.AnalyticsService.getDashboardAnalytics();
            res.json(analytics);
        }
        catch (error) {
            res.status(400).json({
                message: error.message,
            });
        }
    }
    static async inventory(_, res) {
        try {
            const analytics = await analytics_service_1.AnalyticsService.getInventoryAnalytics();
            res.json(analytics);
        }
        catch (error) {
            res.status(400).json({
                message: error.message,
            });
        }
    }
}
exports.AnalyticsController = AnalyticsController;
