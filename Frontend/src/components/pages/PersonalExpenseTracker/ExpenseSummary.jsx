import { Box, Grid, Typography } from "@mui/material";

const cards = [
  {
    title: "Total Spent",
    amount: "₹24,580",
  },
  {
    title: "Budget Left",
    amount: "₹9,580",
  },
];

export default function ExpenseSummary() {
  return (
    <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        {cards.map((card) => (
            <Box
              sx={{
                width: "100%",
                p: 2,
                borderRadius: 5,
                bgcolor: "white",
                border: "2px solid #303030",
              }}
            >
              <Typography color="text.secondary">
                {card.title}
              </Typography>

              <Typography
                fontWeight={600}
                fontSize="1.25rem"
                mt={1}
              >
                {card.amount}
              </Typography>
            </Box>
        ))}
    </Box>
  );
}