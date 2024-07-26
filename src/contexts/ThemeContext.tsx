import React, { createContext, useContext } from "react";
import { theme, Theme } from "../constants/theme";
import { typography, Typography } from "../constants/typography";

type ThemeContextType = {
  theme: Theme;
  typography: Typography;
};

const ThemeContext = createContext<ThemeContextType>({
  theme,
  typography,
});

export const ThemeProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return (
    <ThemeContext.Provider value={{ theme, typography }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
