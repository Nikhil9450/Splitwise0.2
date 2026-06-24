import { Box, Grid, Typography } from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllBudget } from "../../../redux/budget/budgetSlice";


export default function ExpenseSummary({monthYear}) {
  const dispatch = useDispatch();
  const {budgets} = useSelector((state) => state.budget);

  const [totalSpent, setTotalSpent] = useState(0);
  const [budgetLeft, setBudgetLeft] = useState(0);
  const [monthlyBudget, setMonthlyBudget] = useState(0);
  const cards = [
  {
    title: "Total Spent",
    amount: totalSpent,
  },
  {
    title: "Budget Left",
    amount: budgetLeft,
  },
  {
    title: "Budget",
    amount: monthlyBudget,
  },
];

  useEffect(() => {
    dispatch(fetchAllBudget());
  }, [dispatch]);
  useEffect(() => {
    console.log("budget inside ExpenseSummary------->", budgets);
    console.log("asdfsaf",budgets?.find(item => item.month_year === monthYear.format('MM-YYYY'))?.amount);
    setMonthlyBudget(budgets?.find(item => item.month_year === monthYear.format('MM-YYYY'))?.amount || 0);
  }, [budgets, monthYear]);

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