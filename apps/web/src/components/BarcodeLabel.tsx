import { useEffect, useRef } from "react";

import JsBarcode from "jsbarcode";

interface Props {
  value: string;
}

export default function BarcodeLabel({ value }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (svgRef.current) {
      JsBarcode(svgRef.current, value, {
        format: "CODE128",

        width: 2,

        height: 50,

        displayValue: true,
      });
    }
  }, [value]);

  return (
    <div className="bg-white p-2 rounded">
      <svg ref={svgRef}></svg>
    </div>
  );
}
