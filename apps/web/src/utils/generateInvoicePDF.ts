import pdfMake from "pdfmake/build/pdfmake";

import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.vfs;

interface InvoiceItem {
  displayName: string;

  quantity: number;

  price: number;

  gstRate: number;
}

interface InvoiceData {
  invoiceNumber: string;

  customerName?: string;

  items: InvoiceItem[];

  subtotal: number;

  gstTotal: number;

  grandTotal: number;
}

export function generateInvoicePDF(data: InvoiceData) {
  const documentDefinition = {
    content: [
      {
        text: "ELECTRONICS ERP",
        style: "header",
      },

      {
        text: `Invoice #: ${data.invoiceNumber}`,
      },

      {
        text: `Customer: ${data.customerName || "Walk-in Customer"}`,
        margin: [0, 0, 0, 20],
      },

      {
        table: {
          widths: ["*", "auto", "auto", "auto"],

          body: [
            ["Product", "Qty", "GST", "Total"],

            ...data.items.map((item) => [
              item.displayName,

              item.quantity,

              `${item.gstRate}%`,

              `₹${item.quantity * item.price}`,
            ]),
          ],
        },
      },

      {
        margin: [0, 20, 0, 0],

        text: `Subtotal: ₹${data.subtotal.toFixed(2)}`,
      },

      {
        text: `GST: ₹${data.gstTotal.toFixed(2)}`,
      },

      {
        bold: true,

        text: `Grand Total: ₹${data.grandTotal.toFixed(2)}`,
      },
    ],

    styles: {
      header: {
        fontSize: 22,

        bold: true,

        margin: [0, 0, 0, 20],
      },
    },
  };

  pdfMake.createPdf(documentDefinition).open();
}
