import { createTheme, alpha } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "dark",
  },

  components: {
    MuiChip: {
      styleOverrides: {
        root: {
          margin: "4px",
        },
        filledPrimary: {
          color: "#00bbff",
          backgroundColor: alpha("#00bbff", 0.25),
          fontWeight: "500",
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        size: "small",
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          backgroundColor: alpha("#121212", 0.7),
        },
      },
    },
    MuiButtonBase: {
      defaultProps: {},
    },

    MuiDialogTitle: {
      styleOverrides: {
        root: {
          paddingRight: "40px",
        },
      },
    },
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          paddingBottom: 0,
        },
      },
    },
    MuiCardActions: {
      styleOverrides: {
        root: {
          justifyContent: "end",
          paddingTop: 0,
          paddingRight: "16px",
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        button: {
          textTransform: "none",
          padding: "4px 12px",
          borderRadius: "2px",
          "&:hover": {
            background: alpha("#00bbff", 0.1),
          },
        },
      },
    },
    MuiAccordion: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          paddingTop: "12px",
          "&.Mui-expanded": {
            paddingTop: 0,
            background: alpha("#00bbff", 0.1),
          },
        },
      },
    },
  },
});
