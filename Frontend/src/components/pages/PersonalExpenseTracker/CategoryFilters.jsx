import { Chip, Stack } from "@mui/material";

const filters = [
  "All",
  "Food",
  "Travel",
  "Shopping",
  "Bills",
];

export default function CategoryFilters() {
  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{ overflowX: "auto" }}
    >
      {filters.map((item, index) => (
        <Chip
          key={item}
          label={item}
          color={
            index === 0
              ? "primary"
              : "default"
          }
        />
      ))}
    </Stack>
  );
}