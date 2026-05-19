import { Request, Response } from "express";

import { DocumentsService } from "./documents.service";

import { createDocumentSchema } from "./documents.validation";

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

  static async getAllDocuments(_: Request, res: Response) {
    try {
      const documents = await DocumentsService.getAllDocuments();

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
}
