import BarcodeLabel from "@/components/BarcodeLabel";

export default function BarcodePage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Barcode Preview</h1>

      <BarcodeLabel value="8901234567890" />
    </div>
  );
}
