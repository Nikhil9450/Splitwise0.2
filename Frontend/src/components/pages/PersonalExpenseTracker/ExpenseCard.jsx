import {
  Box,
  Typography,
  Stack,
} from "@mui/material";

export default function ExpenseCard({
  expense,
}) {
  return (
    <Box
      sx={{
        p: 2,
        bgcolor: "white",
        borderRadius: 4,
        boxShadow:
          "0 4px 15px rgba(0,0,0,0.06)",
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
      >
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
        >
          <Typography fontSize="2rem">
            {expense.icon}
          </Typography>

          <Box>
            <Typography fontWeight={600}>
              {expense.title}
            </Typography>

            <Typography
              color="text.secondary"
              fontSize=".9rem"
            >
              {expense.category} • {expense.date}
            </Typography>
          </Box>
        </Stack>

        <Typography
          fontWeight={700}
          fontSize="1.2rem"
        >
          ₹{expense.amount}
        </Typography>
      </Stack>
    </Box>
  );
}