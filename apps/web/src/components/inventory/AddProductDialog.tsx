import { useEffect, useState } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api";

import { toast } from "sonner";

import { useInventoryFilters } from "@/features/inventory/useInventoryFilters";

import { generateSKU } from "@/utils/product";

interface Props {
  open: boolean;

  onClose: () => void;
}

export default function AddProductDialog({ open, onClose }: Props) {
  const queryClient = useQueryClient();

  const [loading, setLoading] = useState(false);

  const { categories, brands } = useInventoryFilters();

  const [form, setForm] = useState({
    categoryName: "",

    brandName: "",

    productName: "",

    description: "",

    displayName: "",

    sku: "",

    barcode: "",

    costPrice: 0,

    mrp: 0,

    profitMargin: 0,

    gstRate: 0,

    openingStock: 0,
  });

  // =========================
  // UPDATE FIELD
  // =========================

  function updateField(field: string, value: string | number) {
    setForm((prev) => ({
      ...prev,

      [field]: value,
    }));
  }

  // =========================
  // AUTO SKU
  // =========================

  useEffect(() => {
    const generatedSKU = generateSKU([form.brandName, form.productName]);

    updateField("sku", generatedSKU);
  }, [form.brandName, form.productName]);

  // =========================
  // BARCODE
  // =========================

  function generateBarcode() {
    return String(Date.now()).slice(-12);
  }

  useEffect(() => {
    if (!form.barcode) {
      updateField("barcode", generateBarcode());
    }
  }, []);

  // =========================
  // LIVE SELLING PRICE
  // =========================

  const sellingPrice =
    form.costPrice + (form.costPrice * form.profitMargin) / 100;

  // =========================
  // CREATE PRODUCT
  // =========================

  async function handleCreateProduct() {
    try {
      setLoading(true);

      // =========================
      // VALIDATION
      // =========================

      if (
        !form.categoryName ||
        !form.brandName ||
        !form.productName ||
        !form.displayName ||
        !form.sku ||
        !form.barcode
      ) {
        toast.error("Please fill all required fields");

        return;
      }

      // =========================
      // CREATE CATEGORY
      // =========================

      const categoryResponse = await api.post("/products/categories", {
        name: form.categoryName,
      });

      const categoryId = categoryResponse.data.id;

      // =========================
      // CREATE BRAND
      // =========================

      const brandResponse = await api.post("/products/brands", {
        name: form.brandName,

        categoryId,
      });

      const brandId = brandResponse.data.id;

      // =========================
      // CREATE PRODUCT
      // =========================

      const productResponse = await api.post("/products/products", {
        name: form.productName,

        brandId,

        description: form.description,
      });

      const productId = productResponse.data.id;

      // =========================
      // CREATE VARIANT
      // =========================

      await api.post("/products/variants", {
        productId,

        displayName: form.displayName,

        attributes: {},

        costPrice: form.costPrice,

        mrp: form.mrp,

        profitMargin: form.profitMargin,

        gstRate: form.gstRate,

        sku: form.sku,

        barcode: form.barcode,

        openingStock: form.openingStock,
      });

      // =========================
      // REFRESH INVENTORY
      // =========================

      await queryClient.invalidateQueries({
        queryKey: ["inventory"],
      });

      toast.success("Product created successfully");

      onClose();

      // RESET FORM
      setForm({
        categoryName: "",

        brandName: "",

        productName: "",

        description: "",

        displayName: "",

        sku: "",

        barcode: generateBarcode(),

        costPrice: 0,

        mrp: 0,

        profitMargin: 0,

        gstRate: 0,

        openingStock: 0,
      });
    } catch (error: any) {
      console.error(error);

      toast.error(error?.response?.data?.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-99999 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[95vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        {/* HEADER */}
        <div className="border-b p-6">
          <h2 className="text-3xl font-bold">Add Product</h2>

          <p className="mt-1 text-slate-500">
            Create inventory product and variant
          </p>
        </div>

        {/* BODY */}
        <div className="space-y-6 p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* CATEGORY */}
            <div>
              <label className="mb-2 block text-sm font-medium">Category</label>

              <select
                value={form.categoryName}
                onChange={(e) => updateField("categoryName", e.target.value)}
                className="h-12 w-full rounded-2xl border px-4"
              >
                <option value="">Select Category</option>

                {categories.data?.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>

              <input
                value={form.categoryName}
                onChange={(e) => updateField("categoryName", e.target.value)}
                placeholder="Or type new category"
                className="mt-2 h-12 w-full rounded-2xl border px-4"
              />
            </div>

            {/* BRAND */}
            <div>
              <label className="mb-2 block text-sm font-medium">Brand</label>

              <select
                value={form.brandName}
                onChange={(e) => updateField("brandName", e.target.value)}
                className="h-12 w-full rounded-2xl border px-4"
              >
                <option value="">Select Brand</option>

                {brands.data?.map((brand) => (
                  <option key={brand.id} value={brand.name}>
                    {brand.name}
                  </option>
                ))}
              </select>

              <input
                value={form.brandName}
                onChange={(e) => updateField("brandName", e.target.value)}
                placeholder="Or type new brand"
                className="mt-2 h-12 w-full rounded-2xl border px-4"
              />
            </div>

            {/* PRODUCT */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Product Name
              </label>

              <input
                value={form.productName}
                onChange={(e) => updateField("productName", e.target.value)}
                className="h-12 w-full rounded-2xl border px-4"
                placeholder="Product Name"
              />
            </div>

            {/* DISPLAY NAME */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Display Name
              </label>

              <input
                value={form.displayName}
                onChange={(e) => updateField("displayName", e.target.value)}
                className="h-12 w-full rounded-2xl border px-4"
                placeholder="Display Name"
              />
            </div>

            {/* SKU */}
            <div>
              <label className="mb-2 block text-sm font-medium">SKU</label>

              <input
                value={form.sku}
                onChange={(e) => updateField("sku", e.target.value)}
                className="h-12 w-full rounded-2xl border px-4"
                placeholder="SKU"
              />
            </div>

            {/* BARCODE */}
            <div>
              <label className="mb-2 block text-sm font-medium">Barcode</label>

              <input
                value={form.barcode}
                onChange={(e) => updateField("barcode", e.target.value)}
                className="h-12 w-full rounded-2xl border px-4"
                placeholder="Barcode"
              />
            </div>

            {/* DESCRIPTION */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium">
                Description
              </label>

              <textarea
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                className="min-h-28 w-full rounded-2xl border p-4"
                placeholder="Product description"
              />
            </div>

            {/* COST */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Cost Price
              </label>

              <input
                type="number"
                value={form.costPrice}
                onChange={(e) =>
                  updateField("costPrice", Number(e.target.value))
                }
                className="h-12 w-full rounded-2xl border px-4"
              />
            </div>

            {/* MRP */}
            <div>
              <label className="mb-2 block text-sm font-medium">MRP</label>

              <input
                type="number"
                value={form.mrp}
                onChange={(e) => updateField("mrp", Number(e.target.value))}
                className="h-12 w-full rounded-2xl border px-4"
              />
            </div>

            {/* PROFIT */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Profit Margin %
              </label>

              <input
                type="number"
                value={form.profitMargin}
                onChange={(e) =>
                  updateField("profitMargin", Number(e.target.value))
                }
                className="h-12 w-full rounded-2xl border px-4"
              />

              {/* SELLING PRICE */}
              <div className="mt-3 rounded-2xl border bg-blue-50 p-4">
                <p className="text-sm text-slate-500">Selling Price</p>

                <p className="mt-1 text-2xl font-bold text-blue-600">
                  ₹{sellingPrice.toFixed(2)}
                </p>
              </div>
            </div>

            {/* GST */}
            <div>
              <label className="mb-2 block text-sm font-medium">GST %</label>

              <div className="flex flex-wrap gap-2">
                {[0, 5, 12, 18, 28].map((gst) => (
                  <button
                    key={gst}
                    type="button"
                    onClick={() => updateField("gstRate", gst)}
                    className={`h-11 rounded-xl px-4 transition ${
                      form.gstRate === gst
                        ? "bg-black text-white"
                        : "border bg-white"
                    }`}
                  >
                    {gst}%
                  </button>
                ))}
              </div>
            </div>

            {/* STOCK */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Opening Stock
              </label>

              <input
                type="number"
                value={form.openingStock}
                onChange={(e) =>
                  updateField("openingStock", Number(e.target.value))
                }
                className="h-12 w-full rounded-2xl border px-4"
              />
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-end gap-3 border-t p-6">
          <button onClick={onClose} className="h-12 rounded-2xl border px-6">
            Cancel
          </button>

          <button
            onClick={handleCreateProduct}
            disabled={loading}
            className="h-12 rounded-2xl bg-black px-6 text-white transition hover:bg-slate-800 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Product"}
          </button>
        </div>
      </div>
    </div>
  );
}
