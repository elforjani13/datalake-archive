import React, { FC, useState } from "react";
import {
  Button,
  CircularProgress,
  DialogContent,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import HelpIcon from "@mui/icons-material/Help";
import { ResponsiveDialog } from "./responsive-dialog";

type InfoTooltipProps = {
  label?: string;
  icon?: React.ReactNode;
  title?: string;
  children?: string;
  variant?: "icon" | "text" | "extended";
  dynamic?: boolean;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
};

export const InfoTooltip: FC<InfoTooltipProps> = ({
  label = "More...",
  icon = <HelpIcon />,
  title = "Information",
  variant = "icon",
  dynamic,
  onClick,
  children,
  ...buttonProps
}) => {
  const [open, setOpen] = useState<boolean>(false);

  const handleCloseBtn = () => setOpen(false);
  const handleClickBtn = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    setOpen(true);
  };

  return dynamic || children ? (
    <>
      <ResponsiveDialog
        title={title}
        open={open}
        width="md"
        withCloseButton
        onClose={handleCloseBtn}
      >
        <DialogContent dividers>
          {children ? (
            <Typography component="div" sx={{ "& > p:only-child": { my: 0 } }}>
              {children}
            </Typography>
          ) : (
            <CircularProgress />
          )}
        </DialogContent>
      </ResponsiveDialog>
      <Tooltip title={title}>
        {variant === "icon" ? (
          <IconButton {...buttonProps} onClick={handleClickBtn}>
            {icon}
          </IconButton>
        ) : (
          <Button
            {...buttonProps}
            onClick={handleClickBtn}
            startIcon={variant === "extended" ? icon : undefined}
            sx={{ textTransform: "none" }}
          >
            {label}
          </Button>
        )}
      </Tooltip>
    </>
  ) : null;
};
