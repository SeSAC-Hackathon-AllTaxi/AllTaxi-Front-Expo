import { TextStyle } from "react-native";
import { theme } from "./theme";

export const typography = {
  header: {
    fontFamily: theme.fonts.NotoSansKR.extraBold,
    fontSize: 30,
    lineHeight: 32,
    fontWeight: 500,
  } as TextStyle,
  body: {
    fontFamily: theme.fonts.NotoSansKR.regular,
    fontSize: 16,
    lineHeight: 24,
  } as TextStyle,
};

export type Typography = typeof typography;
