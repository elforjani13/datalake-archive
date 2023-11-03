import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Collapse,
  Divider,
  Grid,
} from "@mui/material";
import {
  Clear as ClearIcon,
  Search as SearchIcon,
  KeyboardDoubleArrowDown as DownIcon,
  KeyboardDoubleArrowUp as UpIcon,
} from "@mui/icons-material";
import { Summary, SummaryProps } from "~/features/summary";
import { SectionDivider } from "~/features/section-divider";

type FormContainerProps = {
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  onReset: React.MouseEventHandler<HTMLButtonElement>;
  disableSubmit: boolean;
  disableReset: boolean;
  children: React.ReactNode[];
  childrenSizes?: Record<string, any>;
} & SummaryProps;

/**
 * handles is the wrapper inside which the form controls are displayed
 * @param param0
 * @returns
 */
export const FormContainer: React.FC<FormContainerProps> = ({
  query,
  requiredFields,
  onSubmit,
  onReset,
  disableSubmit,
  disableReset,
  children,
  childrenSizes,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(!query);

  const handleExpandToggle = () => setIsExpanded(!isExpanded);

  useEffect(() => {
    setIsExpanded(!query);
  }, [query]);

  return (
    <form onSubmit={onSubmit}>
      <Card>
        <Collapse in={isExpanded}>
          <Grid container direction="row" spacing={2}>
            {children
              .filter((c) => c)
              .map((c, i) => (
                <Grid
                  item
                  xs={12}
                  {...(childrenSizes?.[i] ?? { md: 6 })}
                  key={i}
                >
                  {c}
                </Grid>
              ))}
          </Grid>
          <CardActions
            sx={{
              zoom: { xs: 0.85, sm: 1 },
            }}
          >
            {query && (
              <Button startIcon={<DownIcon />} onClick={handleExpandToggle}>
                Hide form
              </Button>
            )}
            <Button
              color="error"
              startIcon={<ClearIcon />}
              onClick={onReset}
              disabled={disableReset}
            >
              Clear form
            </Button>
            <Button
              type="submit"
              variant={disableSubmit ? "text" : "contained"}
              startIcon={<SearchIcon />}
              disabled={disableSubmit}
            >
              Search
            </Button>
          </CardActions>
          {query && (
            <CardHeader
              disableTypography
              title={<SectionDivider title="RESULT FROM LAST SEARCH" />}
            />
          )}
        </Collapse>
        {query && (
          <>
            <Collapse in={!isExpanded}>
              <CardActions
                sx={{
                  mt: 2,
                  mb: -3,
                }}
              >
                <Button
                  startIcon={<UpIcon />}
                  onClick={() => setIsExpanded(true)}
                >
                  Show search form
                </Button>
              </CardActions>
            </Collapse>
            {!isExpanded && (
              <CardHeader disableTypography title={<Divider />} />
            )}
            <CardContent>
              <Summary query={query} requiredFields={requiredFields} />
            </CardContent>
          </>
        )}
      </Card>
    </form>
  );
};
