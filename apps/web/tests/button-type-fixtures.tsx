import { Button } from "@/components/ui/button";

const defaultWithoutAccessibleName = <Button>Default</Button>;
const defaultWithExplicitSizeWithoutAccessibleName = <Button size="default">Default</Button>;
const largeWithoutAccessibleName = <Button size="large">Large</Button>;
const iconWithAriaLabel = (
  <Button aria-label="Pesquisar" size="icon">
    Icon
  </Button>
);
const iconWithAriaLabelledBy = (
  <Button aria-labelledby="search-label" size="icon">
    Icon
  </Button>
);

// @ts-expect-error icon-only buttons must expose an accessible name.
const iconWithoutAccessibleName = <Button size="icon">Icon</Button>;

void defaultWithoutAccessibleName;
void defaultWithExplicitSizeWithoutAccessibleName;
void largeWithoutAccessibleName;
void iconWithAriaLabel;
void iconWithAriaLabelledBy;
void iconWithoutAccessibleName;
