"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentsController = void 0;
const documents_service_1 = require("./documents.service");
const documents_validation_1 = require("./documents.validation");
class DocumentsController {
    static async createDocument(req, res) {
        try {
            const validated = documents_validation_1.createDocumentSchema.parse(req.body);
            const document = await documents_service_1.DocumentsService.createDocument(validated, req.user?.id);
            res.status(201).json(document);
        }
        catch (error) {
            res.status(400).json({
                message: error.message,
            });
        }
    }
    static async getDocument(req, res) {
        try {
            const document = await documents_service_1.DocumentsService.getDocumentById(req.params.id);
            res.json(document);
        }
        catch (error) {
            res.status(400).json({
                message: error.message,
            });
        }
    }
    static async getAllDocuments(_, res) {
        try {
            const documents = await documents_service_1.DocumentsService.getAllDocuments();
            res.json(documents);
        }
        catch (error) {
            res.status(400).json({
                message: error.message,
            });
        }
    }
    static async convertQuotation(req, res) {
        try {
            const invoice = await documents_service_1.DocumentsService.convertQuotationToInvoice(req.params.id);
            res.json(invoice);
        }
        catch (error) {
            res.status(400).json({
                message: error.message,
            });
        }
    }
    static async cancelDocument(req, res) {
        try {
            const result = await documents_service_1.DocumentsService.cancelDocument(req.params.id, req.user?.id);
            res.json(result);
        }
        catch (error) {
            res.status(400).json({
                message: error.message,
            });
        }
    }
    static async returnDocument(req, res) {
        try {
            const result = await documents_service_1.DocumentsService.returnDocument(req.params.id, req.body.reason, req.user?.id);
            res.json(result);
        }
        catch (error) {
            res.status(400).json({
                message: error.message,
            });
        }
    }
}
exports.DocumentsController = DocumentsController;
