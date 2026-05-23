export interface DashboardAnalytics {
  totalRevenue: number;

  totalGST: number;

  totalSales: number;

  totalProductsSold: number;

  topProducts: {
    name: string;
    quantity: number;
    revenue: number;
  }[];

  topCustomers: {
    name: string;
    orders: number;
    amount: number;
  }[];

  topPlaces: {
    place: string;
    orders: number;
    amount: number;
  }[];

  recentSales: {
    id: string;

    date: string;

    customer: string;

    place: string;

    products: string;

    totalItems: number;

    totalAmount: number;

    paymentMode: string;

    status: string;
  }[];
}
