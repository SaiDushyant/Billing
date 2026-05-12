import { Request, Response } from "express";

import { AnalyticsService } from "./analytics.service";

export class AnalyticsController {
  static async dashboard(_: Request, res: Response) {
    try {
      const analytics = await AnalyticsService.getDashboardAnalytics();

      res.json(analytics);
    } catch (error: any) {
      res.status(400).json({
        message: error.message,
      });
    }
  }

  static async inventory(_: Request, res: Response) {
    try {
      const analytics = await AnalyticsService.getInventoryAnalytics();

      res.json(analytics);
    } catch (error: any) {
      res.status(400).json({
        message: error.message,
      });
    }
  }
}
