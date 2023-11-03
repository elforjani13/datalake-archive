import { Typography, TypographyProps } from "@mui/material";
import ReactMarkdown from "react-markdown";

type MarkdownFormattedTextProps = {
  children: string;
} & TypographyProps;

export const MarkdownFormattedText: React.FC<MarkdownFormattedTextProps> = ({
  children,
  ...typographyProps
}) => {
  return (
    <Typography
      component="div"
      {...typographyProps}
      sx={{ "& > p:only-child": { my: 0 } }}
    >
      <ReactMarkdown>{children}</ReactMarkdown>
    </Typography>
  );
};
