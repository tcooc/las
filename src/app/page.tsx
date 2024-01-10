"use client";
import { CssBaseline, useMediaQuery } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useMemo } from "react";
import { EngravingApp } from "@/engravings";

export default function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: light)");

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? "light" : "dark",
        },
        components: {
          MuiFormControl: {
            defaultProps: { variant: "outlined", size: "small" },
          },
          MuiDialog: {
            styleOverrides: {
              paper: {
                maxWidth: 800,
              },
            },
          },
        },
      }),
    [prefersDarkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <EngravingApp />
    </ThemeProvider>
  );
}
