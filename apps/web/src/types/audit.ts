export type AuditLogItem = {
  id: string;

  action: string;

  entityType: string;

  entityId?: string;

  oldData?: any;

  newData?: any;

  metadata?: any;

  createdAt: string;

  user?: {
    id: string;

    name: string;

    email: string;

    role: string;
  };
};

export type AuditLogsResponse = {
  items: AuditLogItem[];

  total: number;

  page: number;

  totalPages: number;
};
