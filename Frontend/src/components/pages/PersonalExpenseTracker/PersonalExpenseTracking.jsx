import React, { useState,useEffect } from "react";
import TextField from "@mui/material/TextField";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import dayjs from 'dayjs';
import ExpenseSummary from "./ExpenseSummary";
import SpendingChart from "./SpendingChart";
import CategoryFilters from "./CategoryFilters";
import ExpenseCard from "./ExpenseCard";
import AddExpenseModal from "./AddExpenseModal";
import MonthYearPicker from "./MonthYearPicker";
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { useDispatch, useSelector } from 'react-redux';
import { openModal } from '../../../redux/modal/modalSlice';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Link } from 'react-router-dom';
import { fetchAllPersonalExpenses ,fetchExpensesByMonthYear} from "../../../redux/personalExpense/PersonalExpenseSlice";
import {addBudget,updateBudget} from "../../../redux/budget/budgetSlice";
import {
  Avatar,
  Box,
  Button,
  Fab,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {fetchAllBudget} from "../../../redux/budget/budgetSlice";
import { toast } from "react-toastify";

export default function PersonalExpenses() {
  const [open, setOpen] = useState(false);
  const [personalExpenseDetails, setPersonalExpenseDetails] = useState([]);
  const [monthYear, setMonthYear] = useState(dayjs());
  const [budget, setBudget] = useState(0);
  const [monthlyBudget, setMonthlyBudget] =useState(0);
  const [budgetId,setBudgetId]= useState("");
  const dispatch = useDispatch();
  const {apiResponse,personalMutationStatus,personalMutationError,monthlyExpenses,monthlyTotal,personalMutationType} = useSelector((state)=>state.personalExpense)
  const [value, setValue] = useState(dayjs());
  const {budgets} = useSelector((state) => state.budget);
  const handleChange = (newValue) => {
  const month = newValue.month() + 1; // 1-12
  const year = newValue.year();

  console.log("Month:", month);
  console.log("Year:", year);

  setMonthYear(newValue);
  };
  useEffect(() => {
      dispatch(fetchExpensesByMonthYear(monthYear.format('MM-YYYY')));
      dispatch(fetchAllBudget());
    }, [dispatch]);

  useEffect(() => {
    console.log("personal expenses api data------->", apiResponse);
    console.log("personalMutationStatus------->", personalMutationStatus);
    console.log("personalMutationError------->", personalMutationError);
    console.log("monthlyExpenses------->", monthlyExpenses);
    if(personalMutationStatus === "succeeded" && personalMutationType === "Fetching monthly expenses"){
      setPersonalExpenseDetails(monthlyExpenses);
    }
  }, [apiResponse, personalMutationStatus, personalMutationError, monthlyExpenses, monthlyTotal]);

  const addPersonalExpenseHandler =()=>{
    dispatch(openModal({
                  modalType: 'ADD_PERSONAL_EXPENSE',
                  modalProps: {
                    title: 'Add Expense',
                  }
    }))
  }
  const addBudgetHandler =(type)=>{
    const data = {
      amount: budget,
      month_year: monthYear.format('MM-YYYY')
    };
    console.log("budget inside addBudgetHandler------->", data);
    if(!budget || !monthYear){
      toast.error("Invalid data")
    }else if( type == "Add"){
      dispatch(addBudget(data));
    }else if (type =="Update"){
      const updatedData = {...data, budgetId}
      dispatch(updateBudget(updatedData));
    }
  }

  useEffect(()=>{
    setMonthlyBudget(budgets?.find(item => item.month_year === monthYear.format('MM-YYYY'))?.amount) ;
    const selectedDateBudget = budgets?.find(item => item.month_year === monthYear.format('MM-YYYY'))
    console.log("budgets from reducer",selectedDateBudget);
    setBudgetId((budgets?.find(item => item.month_year === monthYear.format('MM-YYYY'))?._id))
  },[budgets,monthYear])

  useEffect(() => {
    dispatch(fetchExpensesByMonthYear(monthYear.format('MM-YYYY')));
  }, [monthYear]);
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f8fafc",
        p: 2,
      }}
    >
      {/* Header */}

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
        mt={2}
      >
          <IconButton>
            <ArrowBackIcon />
          </IconButton>
          
<LocalizationProvider dateAdapter={AdapterDayjs}>
  <DatePicker
    label="Select Month"
    views={["year", "month"]}
    format="MM/YYYY"
    value={monthYear}
    onChange={handleChange}
    closeOnSelect
    slotProps={{
      actionBar: {
        actions: [], // Removes OK, Cancel, Today buttons
      },
      textField: {
        size: "small",
    sx: {
      "& .MuiPickersInputBase-root": {
        width: 150,
        borderRadius: "1rem",
      },
      "& .MuiPickersInputBase-sectionsContainer": {
        fontSize: "0.8rem",
        fontFamily: "Montserrat, sans-serif",
      },
    },
        

      },
      desktopPaper: {
        sx: {
          borderRadius: "1rem",
        },
      },
      mobilePaper: {
        sx: {
          borderRadius: "1rem",
        },
      },
    }}
  />
</LocalizationProvider>
      </Stack>
      
      <Stack 
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        
        <Box
            sx={{
              display: "flex",
              width: "100%",
            }}
          >
            <TextField
              fullWidth
              placeholder="Enter your budget"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "1rem 0 0 1rem",
                  height: "40px",
                },
              }}
              onChange={(e) => setBudget(e.target.value)}
            />

            <Button
              variant="contained"
              sx={{
                borderRadius: "0 1rem 1rem 0",
                minWidth: "150px",
                ml: "-1px",
                textTransform: "none",
                fontSize: ".875rem",
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 300,
              }}
              onClick={()=>addBudgetHandler((monthlyBudget)?"Update":"Add")}
            >
             {(monthlyBudget)?"Update Budget":"Add Budget"} 
            </Button>
        </Box>
      </Stack>
      <ExpenseSummary monthYear={monthYear} budgets={budgets} />
      <Box mt={3}>
        <SpendingChart data={personalExpenseDetails} />
      </Box>

      <Box mt={3}>
        <CategoryFilters />
      </Box>

      <Typography
        fontWeight={400}
        mt={3}
        mb={2}
        fontSize="1rem"
        sx={{fontFamily:'Montserrat, sans-serif'}}
      >
        Expenses of {monthYear.format('MM-YYYY')}
      </Typography>

      <Stack spacing={2} sx={{marginBottom:'10rem', height: '15rem', overflowY:'scroll',padding:'1rem',background:'white',borderRadius:'2rem', border:'2px solid black'}}>
        {personalExpenseDetails?.map((expense) => (
                  <ListItem key={expense.id} sx={{padding:'2px', bgcolor: "#ffffff",border:'1.8px solid #5f5f5f', borderRadius:'2rem', marginBottom:'0.5rem'}}>
                    <ListItemButton sx={{ padding: '0px' }} 
                      // component={Link}
                      // to={`/expenseDetails/${expense.id}`}
                      >
                      <Box sx={{ m: '0rem .5rem', textAlign: 'right' }}>
                        <p  
                          style={{ 
                            margin: '0px', 
                            fontSize: '11px', 
                            fontFamily: "Montserrat, sans-serif", 
                            fontWeight: 600, 
                            fontStyle: "normal" 
                            }}
  >
                          {dayjs(expense.date).format('MMM')} <br /> <span>{dayjs(expense.date).format('D')}</span>
                        </p>
                      </Box>
                      <ListItemAvatar sx={{paddingRight:'5px'}}>
                        <Avatar sx={{ borderRadius: '2rem' ,height:'2rem',width:'2rem', bgcolor:'#25291C'}}>
                          <ShoppingBagIcon sx={{fontSize:'1rem'}}/>
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={expense.description}
                        secondary={`₹${expense.amount}`}
                        sx={{margin:'0px'}}
                        primaryTypographyProps={{
                          sx: {
                            fontFamily: "Montserrat, sans-serif",
                            fontWeight: 600,
                            fontStyle: "normal",
                            fontSize:'.8rem'
                          }
                        }}
                        secondaryTypographyProps={{
                          sx: {
                            fontFamily: "Montserrat, sans-serif",
                            fontWeight: 600,
                            fontSize: '0.7rem',
                          }
                        }}
                      />
                      <ListItemText
                        sx={{ textAlign: 'right', pr: 2 }}
                         primary={
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                          <Avatar sx={{ borderRadius: '2rem' ,height:'2rem',width:'2rem', bgcolor:'#ffffff'}}>
                            <IconButton
                              size="small"
                              onClick={() =>dispatch(
                                        openModal({
                                          modalType: 'ADD_PERSONAL_EXPENSE',
                                          modalProps: {
                                            title: 'Edit Your Expense',
                                            description: expense.description,
                                            amount: expense.amount,
                                            date: expense.date,
                                            expenseId: expense._id,
                                          }
                                        })
                                      )}
                            >
                              <EditOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Avatar>
                          <Avatar sx={{ borderRadius: '2rem' ,height:'2rem',width:'2rem', bgcolor:'#ffffff'}}>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => dispatch(
                                          openModal({
                                            modalType: 'DELETE_PERSONAL_EXPENSE',
                                            modalProps: {
                                              title: 'Delete Expense',
                                              expenseId: expense._id,
                                              month_year: dayjs(expense.date).format('MM-YYYY'),
                                            }
                                          })
                                        )}
                              >
                                <DeleteOutlineOutlinedIcon fontSize="small" />
                              </IconButton>
                          </Avatar>
                          </Box>
                        }
                        // secondary={`₹${expense.amount}`}
                        primaryTypographyProps={{
                          sx: {
                            fontSize: '1rem',
                            color: '#ED6A5A',
                            fontWeight: 600,
                            fontFamily: "Montserrat, sans-serif",
                          }
                        }}
                        // secondaryTypographyProps={{
                        //   sx: {
                        //     fontSize: '0.9rem',
                        //     color: '#25291C',
                        //     fontWeight: 600
                        //   }
                        // }}
                      />
                    </ListItemButton>
                  </ListItem>
        ))}
      </Stack>

      <Fab
          onClick={() => addPersonalExpenseHandler()}
          aria-label="Add Expenses"
          variant="extended"
          sx={{
            position: "fixed",
            bottom: 90,
            right: 20,
            zIndex: 10,
            width:{xs:'1rem',md:'10rem'},
            bgcolor:'#25291C',
            border:'none', 
                '&:hover': {
            bgcolor: '#129490',
            color: '#fff',
          }, 
          }}
        >
          <AddIcon sx={{color:"#DFE0DC"}}/>
          <Typography sx={{display:{xs:'none',md:'block'}}}>Add Expenses</Typography>
        </Fab>
    </Box>
  );
}