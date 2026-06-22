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
import { Link } from 'react-router-dom';
import { fetchAllPersonalExpenses } from "../../../redux/personalExpense/PersonalExpenseSlice";
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

const expenses = [
  {
    id: 1,
    description: "Burger King",
    category: "Food",
    amount: 320,
    date: "2026-04-01T07:20:17.696Z",
    icon: "🍔",
  },
  {
    id: 2,
    description: "Uber Ride",
    category: "Travel",
    amount: 450,
    date: "2026-04-01T07:20:17.696Z",
    icon: "🚕",
  },
  {
    id: 3,
    description: "Amazon",
    category: "Shopping",
    amount: 899,
    date: "2026-04-01T07:20:17.696Z",
    icon: "🛒",
  },
];

export default function PersonalExpenses() {
  const [open, setOpen] = useState(false);
  const [personalExpenseDetails, setPersonalExpenseDetails] = useState([]);
  const dispatch = useDispatch();
  const {apiResponse,personalMutationStatus,personalMutationError} = useSelector((state)=>state.personalExpense)

  useEffect(() => {
      dispatch(fetchAllPersonalExpenses());
    }, []);
  useEffect(() => {
    console.log("personal expenses api data------->", apiResponse);
    console.log("personalMutationStatus------->", personalMutationStatus);
    console.log("personalMutationError------->", personalMutationError);
    if(personalMutationStatus === "succeeded"){
      setPersonalExpenseDetails(apiResponse);
    }
  }, [apiResponse, personalMutationStatus, personalMutationError]);

  const addPersonalExpenseHandler =()=>{
    dispatch(openModal({
                  modalType: 'ADD_PERSONAL_EXPENSE',
                  modalProps: {
                    title: 'Add Expense',
                  }
    }))
  }
  const handleEdit=(expense)=>{}
  const handleDelete=(expenseId)=>{}
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
          
         <MonthYearPicker />
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
            >
              Add Budget
            </Button>
        </Box>
      </Stack>
      <ExpenseSummary />
      <Box mt={3}>
        <SpendingChart />
      </Box>

      <Box mt={3}>
        <CategoryFilters />
      </Box>

      <Typography
        fontWeight={700}
        mt={3}
        mb={2}
        fontSize="1.2rem"
      >
        Today
      </Typography>

      <Stack spacing={2}>
        {personalExpenseDetails.map((expense) => (
                  <ListItem key={expense.id} sx={{padding:'2px', bgcolor: "#DFE0DC",border:'1.8px solid #5f5f5f', borderRadius:'2rem', marginBottom:'0.5rem'}}>
                    <ListItemButton sx={{ padding: '0px' }} 
                      // component={Link}
                      // to={`/expenseDetails/${expense.id}`}
                      >
                      <Box sx={{ m: '0rem .5rem', textAlign: 'right' }}>
                        <p  
                          style={{ 
                            margin: '0px', 
                            fontSize: '14px', 
                            fontFamily: "Montserrat, sans-serif", 
                            fontWeight: 600, 
                            fontStyle: "normal" 
                            }}
  >
                          {dayjs(expense.date).format('MMM')} <br /> <span>{dayjs(expense.date).format('D')}</span>
                        </p>
                      </Box>
                      <ListItemAvatar sx={{paddingRight:'5px'}}>
                        <Avatar sx={{ borderRadius: '2rem' ,height:'3rem',width:'3rem', bgcolor:'#25291C'}}>
                          <ShoppingBagIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={expense.description}
                        secondary={`₹${expense.amount}`}
                        primaryTypographyProps={{
                          sx: {
                            fontFamily: "Montserrat, sans-serif",
                            fontWeight: 600,
                            fontStyle: "normal"
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
                            <IconButton
                              size="small"
                              onClick={() => handleEdit(expense)}
                            >
                              <EditIcon fontSize="medium" />
                            </IconButton>

                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDelete(expense.id)}
                            >
                              <DeleteIcon fontSize="medium" />
                            </IconButton>
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

      {/* <Fab
        color="primary"
        onClick={() => setOpen(true)}
        sx={{
          position: "fixed",
          bottom: 90,
          right: 20,
        }}
      >
        <AddIcon />
      </Fab> */}

      {/* <AddExpenseModal
        open={open}
        handleClose={() => setOpen(false)}
      /> */}
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