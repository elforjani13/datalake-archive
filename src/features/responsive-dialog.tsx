import React, { forwardRef } from "react";
import {
  Dialog,
  DialogProps,
  DialogTitle,
  IconButton,
  Breakpoint,
  useMediaQuery,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

type ResponsiveDialogProps = DialogProps & {
  title?: React.ReactNode;
  width?: Breakpoint;
  children?: React.ReactNode;
  withCloseButton?: boolean;
  onClose?: () => void;
  disableCloseOnBackdropClick?: boolean;
};

export const ResponsiveDialog = forwardRef<
  HTMLDivElement,
  ResponsiveDialogProps
>((props, ref) => {
  const {
    title,
    width = "sm",
    onClose,
    children,
    withCloseButton = false,
    disableCloseOnBackdropClick,
    ...rest
  } = props;

  const { breakpoints } = useTheme();
  const fullScreen = useMediaQuery(breakpoints.down(width));

  const closeButton = withCloseButton ? (
    <IconButton
      aria-aria-label="close"
      onClick={onClose}
      size="large"
      sx={{
        position: "absolute",
        top: 0,
        right: 0,
        m: 1,
      }}
    >
      <CloseIcon />
    </IconButton>
  ) : null;

  return (
    <Dialog
      ref={ref}
      maxWidth={width}
      fullWidth
      fullScreen={fullScreen}
      onClose={(_event, reason) => {
        if (!disableCloseOnBackdropClick || reason !== "backdropClick") {
          onClose && onClose();
        }
      }}
      {...rest}
    >
      {title && (
        <DialogTitle>
          {title}
          {closeButton}
        </DialogTitle>
      )}
      {children}
    </Dialog>
  );
});

ResponsiveDialog.displayName = "ResponsiveDialog";
