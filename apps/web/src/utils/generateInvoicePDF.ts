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

  customerPhone?: string;

  customerEmail?: string;

  customerAddress?: string;

  customerGSTNumber?: string;

  items: InvoiceItem[];

  subtotal: number;

  gstTotal: number;

  grandTotal: number;
}

export function generateInvoicePDF(data: InvoiceData) {
  const documentDefinition = {
    pageMargins: [30, 30, 30, 30],

    content: [
      // STORE HEADER
      {
        columns: [
          [
            {
              text: "YOUR STORE NAME",

              style: "storeName",
            },

            {
              text: "Lorem Ipsum Street,\nCoimbatore, Tamil Nadu\nIndia - 641001",

              style: "storeInfo",
            },

            {
              text: "Phone: +91 9876543210",

              style: "storeInfo",
            },
          ],

          [
            {
              text: "LOGO",

              alignment: "right",

              bold: true,

              fontSize: 24,
            },
          ],
        ],
      },

      {
        margin: [0, 15, 0, 15],

        canvas: [
          {
            type: "line",

            x1: 0,

            y1: 0,

            x2: 535,

            y2: 0,

            lineWidth: 1,
          },
        ],
      },

      // BILL TITLE
      {
        text: "TAX INVOICE",

        style: "invoiceTitle",
      },

      // INVOICE INFO
      {
        columns: [
          [
            {
              text: `Invoice #: ${data.invoiceNumber}`,

              style: "invoiceInfo",
            },

            {
              text: `Date: ${new Date().toLocaleDateString()}`,

              style: "invoiceInfo",
            },
          ],

          [
            {
              text: "Customer Details",

              style: "sectionHeader",

              alignment: "right",
            },

            {
              text: data.customerName || "Walk-in Customer",

              alignment: "right",
            },

            data.customerPhone
              ? {
                  text: data.customerPhone,

                  alignment: "right",
                }
              : {},

            data.customerEmail
              ? {
                  text: data.customerEmail,

                  alignment: "right",
                }
              : {},

            data.customerGSTNumber
              ? {
                  text: `GST: ${data.customerGSTNumber}`,

                  alignment: "right",
                }
              : {},

            data.customerAddress
              ? {
                  text: data.customerAddress,

                  alignment: "right",
                }
              : {},
          ],
        ],

        margin: [0, 0, 0, 20],
      },

      // ITEMS TABLE
      {
        table: {
          headerRows: 1,

          widths: ["*", 50, 70, 60, 80],

          body: [
            [
              {
                text: "Product",

                style: "tableHeader",
              },

              {
                text: "Qty",

                style: "tableHeader",
              },

              {
                text: "Price",

                style: "tableHeader",
              },

              {
                text: "GST",

                style: "tableHeader",
              },

              {
                text: "Total",

                style: "tableHeader",
              },
            ],

            ...data.items.map((item) => {
              const total =
                item.quantity * item.price * (1 + item.gstRate / 100);

              return [
                item.displayName,

                item.quantity,

                `₹${item.price.toFixed(2)}`,

                `${item.gstRate}%`,

                `₹${total.toFixed(2)}`,
              ];
            }),
          ],
        },

        layout: {
          fillColor: (rowIndex: number) => {
            return rowIndex === 0 ? "#f1f5f9" : null;
          },

          hLineWidth: () => 0.5,

          vLineWidth: () => 0.5,

          hLineColor: () => "#d1d5db",

          vLineColor: () => "#d1d5db",
        },
      },

      // TOTALS
      {
        margin: [0, 20, 0, 0],

        columns: [
          [{ text: "" }],

          [
            {
              columns: [
                [
                  {
                    text: "Subtotal",
                  },

                  {
                    text: "GST",
                  },

                  {
                    text: "Grand Total",

                    bold: true,
                  },
                ],

                [
                  {
                    text: `₹${data.subtotal.toFixed(2)}`,

                    alignment: "right",
                  },

                  {
                    text: `₹${data.gstTotal.toFixed(2)}`,

                    alignment: "right",
                  },

                  {
                    text: `₹${data.grandTotal.toFixed(2)}`,

                    bold: true,

                    alignment: "right",
                  },
                ],
              ],
            },
          ],
        ],
      },

      // FOOTER
      {
        margin: [0, 40, 0, 0],

        text: "Thank you for your business!",

        alignment: "center",

        italics: true,

        color: "#6b7280",
      },
    ],

    styles: {
      storeName: {
        fontSize: 22,

        bold: true,
      },

      storeInfo: {
        fontSize: 10,

        margin: [0, 2, 0, 0],
      },

      invoiceTitle: {
        fontSize: 18,

        bold: true,

        alignment: "center",

        margin: [0, 0, 0, 20],
      },

      invoiceInfo: {
        fontSize: 11,

        margin: [0, 0, 0, 5],
      },

      sectionHeader: {
        bold: true,

        margin: [0, 0, 0, 5],
      },

      tableHeader: {
        bold: true,

        fontSize: 11,
      },
    },
  };

  pdfMake.createPdf(documentDefinition as any).open();
}
