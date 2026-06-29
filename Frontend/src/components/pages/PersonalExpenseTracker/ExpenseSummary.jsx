import { Box, Grid, Typography } from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllBudget } from "../../../redux/budget/budgetSlice";


export default function ExpenseSummary({monthYear, budgets}) {
  const dispatch = useDispatch();
  const {apiResponse,personalMutationStatus,personalMutationError,monthlyExpenses,monthlyTotal} = useSelector((state)=>state.personalExpense)
  const [totalSpent, setTotalSpent] = useState(0);
  const [budgetLeft, setBudgetLeft] = useState(0);
  const [monthlyBudget, setMonthlyBudget] = useState(0);
  const cards = [
  {
    title: "Total Spent",
    amount: monthlyTotal,
  },
  {
    title: "Budget Left",
    amount: monthlyBudget - monthlyTotal,
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
    setTotalSpent(monthlyTotal || 0);
    setBudgetLeft((budgets?.find(item => item.month_year === monthYear.format('MM-YYYY'))?.amount || 0) - (monthlyTotal || 0));
  }, [budgets, monthYear]);

  useEffect(() => {
    console.log("monthlyExpenses inside ExpenseSummary------->", monthlyExpenses);
    console.log("monthlyTotal inside ExpenseSummary------->", monthlyTotal);
  }, [monthlyExpenses, monthlyTotal]);
  return (
    <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        {cards.map((card) => (
            <Box
              sx={{
                width: "100%",
                p: 1.5,
                borderRadius: 5,
                bgcolor: "white",
                border: "2px solid #303030",
              }}
            >
              <Typography color="text.secondary"
                fontWeight={500}
                fontSize=".7rem"
                sx={{marginBottom:"0px",fontFamily: "Montserrat, sans-serif",}}
              >
                {card.title}
              </Typography>

              <Typography
                fontWeight={600}
                fontSize=".7rem"
                mt={1}
                sx={{marginTop:"0px",fontFamily: "Montserrat, sans-serif",}}
              >
                {card.amount}
              </Typography>
            </Box>
        ))}
    </Box>
  );
}