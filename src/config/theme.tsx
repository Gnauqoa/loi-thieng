import { createTheme, ThemeProvider as REThemeProvider } from "@rneui/themed";
import { ReactNode } from "react";

const theme = createTheme({
  lightColors: {
    primary: "#673ab7",
    
  },
  darkColors: {
    primary: "#673ab7",
  },
  components: {},
});

// Your App
const ThemeProvider = ({ children }: { children: ReactNode }) => {
  return <REThemeProvider theme={theme}>{children}</REThemeProvider>;
};

export default ThemeProvider;
