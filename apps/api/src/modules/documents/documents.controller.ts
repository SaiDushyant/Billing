import { Request, Response } from "express";

import { DocumentsService } from "./documents.service";

import {
  addPaymentSchema,
  createDocumentSchema,
  partialReturnSchema,
  refundPaymentSchema,
} from "./documents.validation";

type Params = {
  id: string;
};

export class DocumentsController {
  static async createDocument(req: Request, res: Response) {
    try {
      const validated = createDocumentSchema.parse(req.body);

      const document = await DocumentsService.createDocument(
        validated,
        req.user?.id,
      );

      res.status(201).json(document);
    } catch (error: any) {
      res.status(400).json({
        message: error.message,
      });
    }
  }

  static async getDocument(req: Request<Params>, res: Response) {
    try {
      const document = await DocumentsService.getDocumentById(req.params.id);

      res.json(document);
    } catch (error: any) {
      res.status(400).json({
        message: error.message,
      });
    }
  }

  static async getAllDocuments(req: Request, res: Response) {
    try {
      const documents = await DocumentsService.getAllDocuments({
        search: req.query.search?.toString(),

        type: req.query.type?.toString(),

        status: req.query.status?.toString(),

        startDate: req.query.startDate?.toString(),

        endDate: req.query.endDate?.toString(),

        page: Number(req.query.page || 1),

        limit: Number(req.query.limit || 10),
      });

      res.json(documents);
    } catch (error: any) {
      res.status(400).json({
        message: error.message,
      });
    }
  }

  static async convertQuotation(req: Request<Params>, res: Response) {
    try {
      const invoice = await DocumentsService.convertQuotationToInvoice(
        req.params.id,
      );

      res.json(invoice);
    } catch (error: any) {
      res.status(400).json({
        message: error.message,
      });
    }
  }

  static async cancelDocument(req: Request<Params>, res: Response) {
    try {
      const result = await DocumentsService.cancelDocument(
        req.params.id,
        req.user?.id,
      );

      res.json(result);
    } catch (error: any) {
      res.status(400).json({
        message: error.message,
      });
    }
  }

  static async returnDocument(req: Request<Params>, res: Response) {
    try {
      const result = await DocumentsService.returnDocument(
        req.params.id,
        req.body.reason,
        req.user?.id,
      );

      res.json(result);
    } catch (error: any) {
      res.status(400).json({
        message: error.message,
      });
    }
  }

  static async updateDocument(req: Request<Params>, res: Response) {
    try {
      const validated = createDocumentSchema.parse(req.body);

      const document = await DocumentsService.updateDocument(
        req.params.id,

        validated,

        req.user?.id,
      );

      res.json(document);
    } catch (error: any) {
      res.status(400).json({
        message: error.message,
      });
    }
  }

  static async finalizeDraft(req: Request<Params>, res: Response) {
    try {
      const document = await DocumentsService.finalizeDraft(
        req.params.id,

        req.user?.id,
      );

      res.json(document);
    } catch (error: any) {
      res.status(400).json({
        message: error.message,
      });
    }
  }

  static async partialReturn(req: Request<Params>, res: Response) {
    try {
      const validated = partialReturnSchema.parse(req.body);

      const result = await DocumentsService.partialReturn(
        req.params.id,

        validated,

        req.user?.id,
      );

      res.json(result);
    } catch (error: any) {
      res.status(400).json({
        message: error.message,
      });
    }
  }

  static async rebillDocument(req: Request<Params>, res: Response) {
    try {
      const result = await DocumentsService.rebillDocument(
        req.params.id,

        req.user?.id,
      );

      res.json(result);
    } catch (error: any) {
      res.status(400).json({
        message: error.message,
      });
    }
  }
  static async addPayment(req: Request<Params>, res: Response) {
    try {
      const validated = addPaymentSchema.parse(req.body);

      const result = await DocumentsService.addPayment(
        req.params.id,
        validated,
      );

      res.json(result);
    } catch (error: any) {
      res.status(400).json({
        message: error.message,
      });
    }
  }

  static async getCustomerLedger(req: Request, res: Response) {
    try {
      const ledger = await DocumentsService.getCustomerLedger(
        String(req.params.customerId),
      );

      res.json(ledger);
    } catch (error: any) {
      res.status(400).json({
        message: error.message,
      });
    }
  }

  static async refundPayment(req: Request<Params>, res: Response) {
    try {
      const validated = refundPaymentSchema.parse(req.body);

      const result = await DocumentsService.refundPayment(
        req.params.id,
        validated,
        req.user?.id,
      );

      res.json(result);
    } catch (error: any) {
      res.status(400).json({
        message: error.message,
      });
    }
  }
}
