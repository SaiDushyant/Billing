interface Props {
  customers: {
    name: string;

    orders: number;

    amount: number;
  }[];
}

export default function TopCustomersCard({ customers }: Props) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Top Customers</h2>

        <button className="text-sm text-blue-600">View All</button>
      </div>

      <div className="max-h-87.5 space-y-5 overflow-y-auto pr-2">
        {customers.map((customer) => (
          <div
            key={customer.name}
            className="flex items-center justify-between"
          >
            <div>
              <h3 className="font-medium">{customer.name}</h3>

              <p className="text-sm text-slate-500">{customer.orders} Orders</p>
            </div>

            <div className="font-semibold">₹{customer.amount.toFixed(2)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
