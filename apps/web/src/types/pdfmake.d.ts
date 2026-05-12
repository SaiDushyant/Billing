declare module "pdfmake/build/pdfmake" {
  import pdfMake from "pdfmake";

  export default pdfMake;
}

declare module "pdfmake/build/vfs_fonts" {
  export const vfs: Record<string, string>;

  const fonts: {
    vfs: Record<string, string>;
  };

  export default fonts;
}
