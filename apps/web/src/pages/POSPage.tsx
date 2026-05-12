import { ShoppingCart } from "lucide-react";
import { useState } from "react";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { usePOSStore } from "@/store/pos.store";
import { useProductSearch } from "@/features/pos/useProductSearch";

import { api } from "@/lib/api";

import { generateInvoicePDF } from "@/utils/generateInvoicePDF";

export default function POSPage() {
  const [search, setSearch] = useState("");

  const { cart, addToCart, clearCart } = usePOSStore();

  const { data: products = [] } = useProductSearch(search);

  const subtotal = cart.reduce(
    (acc, item) => acc + item.quantity * item.sellingPrice,
    0,
  );

  const gstTotal = cart.reduce(
    (acc, item) =>
      acc + (item.quantity * item.sellingPrice * item.gstRate) / 100,
    0,
  );

  const grandTotal = subtotal + gstTotal;

  async function handleCheckout() {
    if (cart.length === 0) {
      return;
    }

    try {
      const response = await api.post("/documents", {
        type: "BILL",

        items: cart.map((item) => ({
          variantId: item.variantId,

          quantity: item.quantity,
        })),

        payment: {
          amount: grandTotal,

          method: "CASH",
        },
      });

      generateInvoicePDF({
        invoiceNumber: response.data.id,

        items: cart.map((item) => ({
          displayName: item.displayName,

          quantity: item.quantity,

          price: item.sellingPrice,

          gstRate: item.gstRate,
        })),

        subtotal,

        gstTotal,

        grandTotal,
      });

      alert("Bill Created");

      clearCart();
    } catch (error) {
      console.error(error);

      alert("Checkout failed");
    }
  }

  return (
    <div className="h-screen flex">
      {/* LEFT PANEL */}
      <div className="w-64 border-r bg-white p-4">
        <h2 className="font-bold text-lg mb-4">Categories</h2>

        <div className="space-y-2">
          <button className="w-full text-left p-2 rounded hover:bg-slate-100">
            MCB
          </button>

          <button className="w-full text-left p-2 rounded hover:bg-slate-100">
            Switches
          </button>
        </div>
      </div>

      {/* CENTER */}
      <div className="flex-1 p-4 overflow-auto">
        <Input
          placeholder="Search SKU / Barcode / Product"
          className="mb-4 h-12 text-lg"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="grid grid-cols-4 gap-4">
          {products.map((product) => (
            <Card
              key={product.id}
              className="p-4 cursor-pointer hover:shadow-lg transition"
              onClick={() =>
                addToCart({
                  variantId: product.id,

                  displayName: product.displayName,

                  quantity: 1,

                  sellingPrice: Number(product.sellingPrice),

                  gstRate: Number(product.gstRate),
                })
              }
            >
              <h3 className="font-semibold">{product.displayName}</h3>

              <p className="text-sm text-gray-500">SKU: {product.sku}</p>

              <p className="text-sm text-gray-500">
                Barcode: {product.barcode}
              </p>

              <p className="font-bold mt-2">
                ₹{Number(product.sellingPrice).toFixed(2)}
              </p>
            </Card>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-96 border-l bg-white p-4 flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <ShoppingCart size={20} />

          <h2 className="font-bold text-lg">Cart</h2>
        </div>

        <div className="flex-1 space-y-3 overflow-auto">
          {cart.map((item) => (
            <Card key={item.variantId} className="p-3">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-medium">{item.displayName}</h3>

                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>

                <div>₹{(item.quantity * item.sellingPrice).toFixed(2)}</div>
              </div>
            </Card>
          ))}
        </div>

        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>

            <span>₹{subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span>GST</span>

            <span>₹{gstTotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-xl font-bold">
            <span>Total</span>

            <span>₹{grandTotal.toFixed(2)}</span>
          </div>

          <button
            onClick={handleCheckout}
            className="w-full h-12 bg-black text-white rounded-lg mt-4"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
