import { FC } from "react";
import { Chip, ChipProps, Divider, Typography } from "@mui/material";

type SectionDividerProps = {
  title: string;
  tags?: string[] | undefined;
  color?: ChipProps["color"];
  [key: string]: unknown;
};

export const SectionDivider: FC<SectionDividerProps> = ({
  title,
  tags,
  color,
  ...dividerProps
}) => {
  const titleParts = (title || "").split("@{tags}");

  return (
    <Divider {...dividerProps}>
      <Typography
        variant="overline"
        color={color}
        sx={{
          fontWeight: "bold",
        }}
      >
        {titleParts.map((titlePart: string, index: number) => (
          <>
            {titlePart}
            {index === 0 &&
              tags?.length &&
              tags.map((tag: string) => (
                <Chip key={tag} label={tag} size="small" />
              ))}
          </>
        ))}
      </Typography>
    </Divider>
  );
};
