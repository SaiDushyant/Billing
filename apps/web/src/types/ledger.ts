export type LedgerEntry = {
  id: string;

  type: string;

  status: string;

  createdAt: string;

  debit: number;

  credit: number;

  balance: number;

  dueAmount: number;

  isPaid: boolean;
};

export type CustomerLedger = {
  entries: LedgerEntry[];

  totalDebit: number;

  totalCredit: number;

  outstanding: number;
};
