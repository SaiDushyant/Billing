import { Request, Response } from "express";

import { AuditService } from "./audit.service";

export class AuditController {
  // =========================
  // GET LOGS
  // =========================

  static async getLogs(req: Request, res: Response) {
    try {
      const logs = await AuditService.getLogs({
        search: req.query.search as string,

        action: req.query.action as string,

        entityType: req.query.entityType as string,

        startDate: req.query.startDate as string,

        endDate: req.query.endDate as string,

        page: Number(req.query.page || 1),

        limit: Number(req.query.limit || 10),
      });

      res.json(logs);
    } catch (error: any) {
      res.status(400).json({
        message: error.message,
      });
    }
  }

  // =========================
  // EXPORT LOGS
  // =========================

  static async exportLogs(req: Request, res: Response) {
    try {
      const logs = await AuditService.exportLogs({
        search: req.query.search as string,

        action: req.query.action as string,

        entityType: req.query.entityType as string,

        startDate: req.query.startDate as string,

        endDate: req.query.endDate as string,
      });

      const csvRows = [
        [
          "Action",
          "Entity Type",
          "Entity ID",
          "User",
          "Role",
          "Created At",
        ].join(","),
      ];

      for (const log of logs) {
        csvRows.push(
          [
            log.action,

            log.entityType,

            log.entityId || "",

            log.user?.name || "System",

            log.user?.role || "",

            log.createdAt.toISOString(),
          ].join(","),
        );
      }

      const csv = csvRows.join("\n");

      res.setHeader(
        "Content-Disposition",
        "attachment; filename=audit-logs.csv",
      );

      res.setHeader("Content-Type", "text/csv");

      res.send(csv);
    } catch (error: any) {
      res.status(400).json({
        message: error.message,
      });
    }
  }
}
