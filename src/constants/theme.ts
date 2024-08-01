export const theme = {
  colors: {
    primary: "#e27343",
    secondary: "#9bd9c1",
    background: "#FFFFFF",
    text: {
      primary: "#000000",
      secondary: "#76838f",
    },
    error: "#FF5252",
    success: "#19b87e",
    warning: "#FFC107",
    info: "#2196F3",
    emphasis: "#ff0000",
  },
  fonts: {
    NotoSansKR: {
      black: "NotoSansKR-Black",
      bold: "NotoSansKR-Bold",
      extraBold: "NotoSansKR-ExtraBold",
      extraLight: "NotoSansKR-ExtraLight",
      light: "NotoSansKR-Light",
      medium: "NotoSansKR-Medium",
      regular: "NotoSansKR-Regular",
      semiBold: "NotoSansKR-SemiBold",
      thin: "NotoSansKR-Thin",
    },
  },
};

export type Theme = typeof theme;
