interface Props {
  sales: {
    id: string;

    customer: string;

    place: string;

    products: string;

    totalItems: number;

    totalAmount: number;

    paymentMode: string;

    status: string;
  }[];
}

export default function RecentSalesTable({ sales }: Props) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Recent Sales</h2>

        <button className="rounded-xl bg-blue-600 px-5 py-2 text-white">
          View All Sales
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-225">
          <thead className="border-b text-sm text-slate-500">
            <tr>
              <th className="p-3 text-left">Customer</th>

              <th className="p-3 text-left">Place</th>

              <th className="p-3 text-left">Products</th>

              <th className="p-3 text-left">Items</th>

              <th className="p-3 text-left">Amount</th>

              <th className="p-3 text-left">Payment</th>

              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {sales.map((sale) => (
              <tr key={sale.id} className="border-b">
                <td className="p-3">{sale.customer}</td>

                <td className="p-3">{sale.place}</td>

                <td className="p-3">{sale.products}</td>

                <td className="p-3">{sale.totalItems}</td>

                <td className="p-3 font-semibold">
                  ₹{sale.totalAmount.toFixed(2)}
                </td>

                <td className="p-3">{sale.paymentMode}</td>

                <td className="p-3">
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-600">
                    {sale.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
