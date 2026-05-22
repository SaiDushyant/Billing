import { useEffect, useMemo, useState } from "react";

import { toast } from "sonner";

import CustomerInfoCard from "@/components/invoice/CustomerInfoCard";
import InvoiceActions from "@/components/invoice/InvoiceActions";
import InvoiceItemsTable from "@/components/invoice/InvoiceItemsTable";
import InvoiceSummary from "@/components/invoice/InvoiceSummary";

import {
  calculateInvoiceTotals,
  calculateLineTotal,
  createEmptyInvoiceRow,
} from "@/utils/invoice";

import type {
  InvoiceDocumentType,
  InvoiceItem,
  ProductSearchResult,
} from "@/types/invoice";

import type { Customer } from "@/types/customer";

import type { BillingUser } from "@/types/user";

import { useProductSearch } from "@/features/pos/useProductSearch";

import { api } from "@/lib/api";

import { generateInvoicePDF } from "@/utils/generateInvoicePDF";

import InvoicePreviewDialog from "@/components/invoice/InvoicePreviewDialog";
import { useAuthStore } from "@/store/auth.store";

export default function InvoicePage() {
  const [documentType, setDocumentType] =
    useState<InvoiceDocumentType>("INVOICE");

  const [customer, setCustomer] = useState<Customer>({
    id: "",

    name: "",

    phone: "",

    email: "",

    address: "",

    gstNumber: "",
  });

  const authUser = useAuthStore((state) => state.user);

  const [billingUser, setBillingUser] = useState<BillingUser | null>(
    authUser
      ? {
          id: authUser.id,

          name: authUser.name,

          email: authUser.email,

          role: authUser.role,
        }
      : null,
  );

  const [users, setUsers] = useState<BillingUser[]>([]);

  const [items, setItems] = useState<InvoiceItem[]>([createEmptyInvoiceRow()]);

  const [shippingCharges, setShippingCharges] = useState(0);

  const [discountTotal, setDiscountTotal] = useState(0);

  const [isSaving, setIsSaving] = useState(false);

  const [isSavingCustomer, setIsSavingCustomer] = useState(false);

  const [showPreview, setShowPreview] = useState(false);

  const searchTerm = useMemo(() => {
    return items.map((item) => item.search || "").join(" ");
  }, [items]);

  const { data: rawProducts = [] } = useProductSearch(searchTerm);

  const products: ProductSearchResult[] = rawProducts.map((product) => ({
    id: product.id,

    displayName: product.displayName,

    sku: product.sku,

    barcode: product.barcode,

    mrp: Number(product.mrp),

    gstRate: Number(product.gstRate),

    sellingPrice: Number(product.sellingPrice),

    costPrice: Number(product.costPrice),

    profitMargin: Number(product.profitMargin),
  }));

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await api.get("/auth/users");

        setUsers(response.data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchUsers();
  }, []);

  const totals = calculateInvoiceTotals(items, shippingCharges);

  function handleAddRow() {
    setItems((prev) => [...prev, createEmptyInvoiceRow()]);
  }

  function handleRemoveRow(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  function handleUpdateRow(id: string, updates: Partial<InvoiceItem>) {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) {
          return item;
        }

        const updatedItem = {
          ...item,
          ...updates,
        };

        return {
          ...updatedItem,

          lineTotal: calculateLineTotal(updatedItem),
        };
      }),
    );
  }

  function handleSelectProduct(rowId: string, product: ProductSearchResult) {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== rowId) {
          return item;
        }

        const updatedItem = {
          ...item,

          variantId: product.id,

          displayName: product.displayName,

          sku: product.sku,

          barcode: product.barcode,

          quantity: 1,

          unitPrice: Number(product.sellingPrice),

          gstRate: Number(product.gstRate),

          mrp: Number(product.mrp),

          costPrice: Number(product.costPrice),

          profitMargin: Number(product.profitMargin),

          search: product.displayName,

          showDropdown: false,
        };

        return {
          ...updatedItem,

          lineTotal: calculateLineTotal(updatedItem),
        };
      }),
    );
  }

  async function handleSaveCustomer() {
    try {
      if (!customer.name.trim()) {
        toast.error("Customer name required");

        return;
      }

      setIsSavingCustomer(true);

      let response;

      if (customer.id) {
        response = await api.patch(`/customers/${customer.id}`, {
          name: customer.name,

          phone: customer.phone,

          email: customer.email,

          address: customer.address,

          gstNumber: customer.gstNumber,
        });
      } else {
        response = await api.post("/customers", {
          name: customer.name,

          phone: customer.phone,

          email: customer.email,

          address: customer.address,

          gstNumber: customer.gstNumber,
        });
      }

      setCustomer(response.data);

      toast.success(customer.id ? "Customer updated" : "Customer saved");
    } catch (error: unknown) {
      console.error(error);

      const message =
        error instanceof Error ? error.message : "Failed to save customer";

      toast.error(message);
    } finally {
      setIsSavingCustomer(false);
    }
  }

  async function handleSave() {
    try {
      setIsSaving(true);

      const invalidItems = items.filter(
        (item) =>
          !item.variantId || !item.displayName.trim() || item.quantity <= 0,
      );

      if (invalidItems.length > 0) {
        toast.error("Please select valid inventory items for all rows.");

        return;
      }

      let customerId: string | undefined = undefined;

      if (customer.name.trim()) {
        const response = await api.post("/customers", {
          name: customer.name,

          phone: customer.phone,

          email: customer.email,

          address: customer.address,

          gstNumber: customer.gstNumber,
        });

        customerId = response.data.id;
      }

      const payload: {
        type: InvoiceDocumentType;

        customerId?: string;

        customerName?: string;

        customerPhone?: string;

        customerEmail?: string;

        customerAddress?: string;

        customerGSTNumber?: string;

        billingUserId?: string;

        items: {
          variantId: string;
          quantity: number;
        }[];

        payment?: {
          amount: number;
          method: string;
        };
      } = {
        type: documentType,

        customerId,

        customerName: customer.name,

        customerPhone: customer.phone,

        customerEmail: customer.email,

        customerAddress: customer.address,

        customerGSTNumber: customer.gstNumber,

        billingUserId: billingUser?.id,

        items: items.map((item) => ({
          variantId: item.variantId,

          quantity: item.quantity,
        })),

        payment:
          documentType === "INVOICE" || documentType === "BILL"
            ? {
                amount: totals.grandTotal,

                method: "CASH",
              }
            : undefined,
      };

      const response = await api.post("/documents", payload);

      generateInvoicePDF({
        invoiceNumber: response.data.id,

        customerName: customer.name,

        customerPhone: customer.phone,

        customerEmail: customer.email,

        customerAddress: customer.address,

        customerGSTNumber: customer.gstNumber,

        items: items.map((item) => ({
          displayName: item.displayName,

          quantity: item.quantity,

          price: item.unitPrice,

          gstRate: item.gstRate,
        })),

        subtotal: totals.subtotal,

        gstTotal: totals.gstTotal,

        grandTotal: totals.grandTotal,
      });

      toast.success(`${documentType} saved successfully`);

      handleReset();
    } catch (error: unknown) {
      console.error(error);

      const message =
        error instanceof Error ? error.message : "Failed to save document";

      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  }

  function handleReset() {
    setItems([createEmptyInvoiceRow()]);

    setShippingCharges(0);

    setDiscountTotal(0);

    setDocumentType("INVOICE");

    setCustomer({
      id: "",

      name: "",

      phone: "",

      email: "",

      address: "",

      gstNumber: "",
    });

    if (authUser) {
      setBillingUser({
        id: authUser.id,

        name: authUser.name,

        email: authUser.email,

        role: authUser.role,
      });
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <CustomerInfoCard
            customer={customer}
            onChange={setCustomer}
            onSaveCustomer={handleSaveCustomer}
            isSavingCustomer={isSavingCustomer}
          />

          <InvoiceItemsTable
            items={items}
            products={products}
            onUpdate={handleUpdateRow}
            onSelectProduct={handleSelectProduct}
            onRemove={handleRemoveRow}
            onAddRow={handleAddRow}
          />
        </div>

        <div className="space-y-6">
          <InvoiceSummary
            totals={{
              ...totals,

              discountTotal,

              shippingCharges,
            }}
            shippingCharges={shippingCharges}
            discountTotal={discountTotal}
            onShippingChange={setShippingCharges}
            onDiscountChange={setDiscountTotal}
          />

          <InvoiceActions
            documentType={documentType}
            billingUser={billingUser}
            users={users}
            isSaving={isSaving}
            onDocumentTypeChange={setDocumentType}
            onBillingUserChange={setBillingUser}
            onSave={() => setShowPreview(true)}
            onReset={handleReset}
          />

          <InvoicePreviewDialog
            open={showPreview}
            documentType={documentType}
            customer={customer}
            items={items}
            totals={totals}
            billingUser={billingUser}
            isSaving={isSaving}
            onClose={() => setShowPreview(false)}
            onConfirm={async () => {
              await handleSave();

              setShowPreview(false);
            }}
          />
        </div>
      </div>
    </div>
  );
}
