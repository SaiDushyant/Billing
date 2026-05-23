import { Request, Response } from "express";

import { AnalyticsService } from "./analytics.service";

export class AnalyticsController {
  static async dashboard(req: Request, res: Response) {
    try {
      const { startDate, endDate, top } = req.query;

      const analytics = await AnalyticsService.getDashboardAnalytics({
        startDate: startDate as string,

        endDate: endDate as string,

        top: Number(top) || 5,
      });

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
