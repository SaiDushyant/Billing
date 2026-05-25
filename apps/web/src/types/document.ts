export type DocumentItem = {
  id: string;

  type: string;

  status: string;

  customerName: string;

  customerPhone?: string;

  grandTotal: number;

  subtotal: number;

  gstTotal: number;

  paidAmount: number;

  dueAmount: number;

  isPaid: boolean;

  createdAt: string;

  createdBy?: {
    id: string;

    name: string;

    role: string;
  };

  itemCount: number;

  paymentCount: number;
};

export type DocumentsResponse = {
  items: DocumentItem[];

  total: number;

  page: number;

  totalPages: number;
};

export type DocumentPreviewItem = {
  id: string;

  quantity: number;

  returnedQuantity: number;

  unitPrice: number;

  gstRate: number;

  lineTotal: number;

  returns?: {
    id: string;

    quantity: number;

    refundAmount: number;

    reason: string;

    createdAt: string;
  }[];

  variant: {
    id: string;

    displayName: string;

    sku: string;

    barcode: string;
  };
};

export type PaymentPreview = {
  id: string;

  amount: number;

  method: string;

  status: string;

  referenceNumber?: string;

  notes?: string;

  isRefunded: boolean;

  refundedAmount?: number;

  createdAt: string;
};

export type FullDocument = {
  id: string;

  type: string;

  status: string;

  customerName?: string;

  customerPhone?: string;

  customerEmail?: string;

  customerAddress?: string;

  customerGSTNumber?: string;

  subtotal: number;

  gstTotal: number;

  grandTotal: number;

  paidAmount: number;

  dueAmount: number;

  isPaid: boolean;

  createdAt: string;

  createdBy?: {
    id: string;

    name: string;

    role: string;
  };

  items: DocumentPreviewItem[];

  payments: PaymentPreview[];
};
