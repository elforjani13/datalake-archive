import { FC, ReactNode } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Stack,
  Typography,
  Breakpoint,
  ChipProps,
  useTheme,
  useMediaQuery,
} from "@mui/material";

type SectionProps = {
  title?: string;
  color?: ChipProps["color"];
  direction?: "column" | "row";
  maxWidth?: Breakpoint;
  outlined?: boolean;
  divider?: boolean | string;
  spacing?: number;
  rowSpacing?: number;
  children: ReactNode | ReactNode[];
};

/**
 * displays a list of fields grouped under an optional label
 * @param param0
 * @returns
 */
export const Section: FC<SectionProps> = ({
  title,
  direction,
  divider = false,
  outlined = false,
  color = "primary",
  maxWidth = "sm",
  rowSpacing = 2,
  spacing = 6,
  children,
}) => {
  const { breakpoints } = useTheme();
  const verticalLayout = useMediaQuery(breakpoints.down(maxWidth));

  const contents = (
    <Stack
      spacing={verticalLayout || divider ? rowSpacing : spacing}
      justifyContent="space-between"
      direction={direction ?? (verticalLayout ? "column" : "row")}
      divider={
        divider && (
          <Divider
            flexItem
            orientation={verticalLayout ? "horizontal" : "vertical"}
          >
            {typeof divider === "string" && (
              <Typography variant="overline">{divider}</Typography>
            )}
          </Divider>
        )
      }
    >
      {children}
    </Stack>
  );
  return (
    <Card {...(outlined ? { variant: "outlined" } : {})}>
      {title && (
        <CardHeader
          disableTypography
          title={
            <Divider light>
              <Chip label={title} color={color} />
            </Divider>
          }
        />
      )}
      <CardContent>{contents}</CardContent>
    </Card>
  );
};


