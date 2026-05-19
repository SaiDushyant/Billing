import { AuditAction } from "@prisma/client";

import { AuditService } from "../modules/audit/audit.service";

export async function createAuditLog({
  req,

  action,

  entityType,

  entityId,

  oldData,

  newData,

  metadata,
}: {
  req: any;

  action: AuditAction;

  entityType: string;

  entityId?: string;

  oldData?: any;

  newData?: any;

  metadata?: any;
}) {
  await AuditService.log({
    userId: req.user?.id,

    action,

    entityType,

    entityId,

    oldData,

    newData,

    metadata,
  });
}
