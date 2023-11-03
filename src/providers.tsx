import React from "react";
import { Paper, ThemeProvider, CssBaseline } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { theme } from "~/theme";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Paper elevation={0} sx={{ px: 4, py: 2, minHeight: "100vh" }}>
          {children}
        </Paper>
      </LocalizationProvider>
    </ThemeProvider>
  );
}
