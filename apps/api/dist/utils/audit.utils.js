"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuditLog = createAuditLog;
const audit_service_1 = require("../modules/audit/audit.service");
async function createAuditLog({ req, action, entityType, entityId, oldData, newData, metadata, }) {
    await audit_service_1.AuditService.log({
        userId: req.user?.id,
        action,
        entityType,
        entityId,
        oldData,
        newData,
        metadata,
    });
}
