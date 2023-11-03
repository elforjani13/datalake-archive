import React, { useRef } from "react";
import ReactToPrint, { ITriggerProps } from "react-to-print";
import { Button, Paper } from "@mui/material";
import { ThemeProvider } from "@mui/material";
import { theme } from "~/theme";

type PrintViewButtonProps = {
  title?: string;
  content?: React.ReactNode;
  trigger?: <T>() => React.ReactElement<ITriggerProps<T>>;
  buttonProps?: React.ComponentProps<typeof Button>;
  onClick?: () => void;
};

export const PrintViewButton: React.FC<PrintViewButtonProps> = ({
  title,
  content,
  trigger,
  buttonProps = { variant: "contained", color: "primary" },
}) => {
  const ref = useRef(null);

  const renderTrigger = () =>
    trigger ? trigger() : <Button {...buttonProps}>Print</Button>;

  const renderContent = () => ref.current;

  return (
    <React.Fragment>
      <ReactToPrint trigger={renderTrigger} content={renderContent} />
      <ThemeProvider theme={theme}>
        <Paper
          ref={ref}
          elevation={0}
          sx={{
            display: "none",
            "@media print": {
              display: "block",
              p: 4,
              "& table": {
                width: "100%",
              },
              "& th": {
                py: 2,
                opacity: 0.3,
                textAlign: "center",
              },
              "& ul:not(:first-of-type)": {
                breakBefore: "page",
              },
            },
          }}
        >
          <table>
            <thead>
              <tr>
                <th>{title}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{content}</td>
              </tr>
            </tbody>
          </table>
        </Paper>
      </ThemeProvider>
    </React.Fragment>
  );
};
