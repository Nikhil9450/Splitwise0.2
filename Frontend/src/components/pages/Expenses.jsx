import React, { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { openModal } from '../../redux/modal/modalSlice';
import { fetchUserGroups } from '../../redux/userGroups/userGroupsSlice';
import { fetchGroupExpenses, deleteExpense, fetchSingleExpense } from '../../redux/expense/expenseSlice';
import { setViewType } from '../../redux/GroupViewType/viewTypeSlice';
import { Link } from 'react-router-dom';
// MUI Core
import {
  Avatar,
  Box,
  Button,
  Divider,
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

// MUI Icons
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { useParams } from 'react-router-dom';
import arrorBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
const Expenses = () => {
  const {user} =useSelector((state)=>state.auth);
  const {expense,expenseDetail}=useSelector((state)=>state.expenses);
  const [groupMemberList,SetGroupMemberList]=useState([]);
  // const [groupId,SetGroupId]=useState(null);
  const {GroupDetails,UserGroupList} = useSelector((state)=>state.userGroups);
  const {viewType} = useSelector((state)=>state.viewType);
  const [selectedGroup,setSelectedGroup]= useState("");
  const [expense_details,setExpense_details]=useState({});
  const [expense_container,setExpense_container] = useState(false);
  const [splitBalance,setSplitBalance]= useState([]);
  const [groupTotalAmt,setGroupTotalAmt]=useState(0);
  const [viewMembers,setViewMembers]=useState(false);
  // const [viewType,setViewType]=useState("groups");
  const [groupName,setGroupName]=useState("");
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { id: groupId } = useParams();

  console.log(groupId); // item.id
  const addExpenseHandler =()=>{
        console.log("groupMemberList from group.jsx----->",groupMemberList)

    dispatch(openModal({
                  modalType: 'ADD_EXPENSE',
                  modalProps: {
                    title: 'Add Expense',
                    groupId:groupId,
                    groupMemberList:groupMemberList,
                  }
    }))
  }

  useEffect(()=>{
    dispatch(fetchGroupExpenses(groupId));
  },[])


  useEffect(() => {
    console.log("expenses------------>", expense);
    const balances = {};

    // Step 1: Build raw balances
    let totalBalance=0;
    expense.forEach((expense) => {
      expense.splitBetweenWithAmt.forEach((split) => {
        const from = split.user._id;
        const to = split.owesTo._id;
        const amount = split.amount;
        totalBalance = totalBalance + amount;
        if (from !== to) {
          if (!balances[from]) balances[from] = {};
          if (!balances[from][to]) balances[from][to] = 0;
          balances[from][to] += amount;
        }
      });
    });
    setGroupTotalAmt(totalBalance);
    console.log("balances ----------->", balances);

    // Step 2: Filter only balances for current user
    const filteredBalance = balances[user.id];
    const filteredWithName = [];

    for (const toId in filteredBalance) {
      const toUser = groupMemberList.find((u) => u._id === toId)?.name || toId;
      const amount = filteredBalance[toId];

      filteredWithName.push({
        name: toUser,
        amount: amount
      });
    }

    console.log("filteredWithName----------->", filteredWithName);

    // Step 3: Convert all balances to flat array with names
    let split_balance = [];
    for (const fromId in balances) {
      for (const toId in balances[fromId]) {
        const fromUser = groupMemberList.find((u) => u._id === fromId)?.name || fromId;
        const toUser = groupMemberList.find((u) => u._id === toId)?.name || toId;
        const amount = balances[fromId][toId];

        split_balance.push({
          from: fromUser,
          to: toUser,
          amount: parseFloat(amount.toFixed(2))
        });
      }
    }

    console.log("split balance-------->",split_balance);

    // Step 4: Simplify mutual transactions
    const netMap = {};
    split_balance.forEach(({ from, to, amount }) => {
      const key = `${from}->${to}`;
      const reverseKey = `${to}->${from}`;

      if (netMap[reverseKey]) {
        if (netMap[reverseKey] > amount) {
          netMap[reverseKey] -= amount;
        } else if (netMap[reverseKey] < amount) {
          netMap[key] = amount - netMap[reverseKey];
          delete netMap[reverseKey];
        } else {
          delete netMap[reverseKey]; // balances out
        }
      } else {
        netMap[key] = (netMap[key] || 0) + amount;
      }
    });

    const reduced_amt = Object.entries(netMap).map(([key, amount]) => {
      const [from, to] = key.split("->");
      return { from, to, amount };
    });

    console.log("reduced amt------------->", reduced_amt);

    // Step 5: Save reduced result to state
    setSplitBalance(reduced_amt);

  }, [expense]);  

  console.log("expense in expenses",expense)
  return (
    <Box sx={{  height: '100%'}}>
                    <Box sx={{display:'flex',justifyContent:'end',height:'7%', bgcolor: '#e3f2fd',}}>
                      <IconButton aria-label="close" size="small" onClick={()=>navigate(-1)} sx={{padding:'2rem'}}>
                        <ArrowBackIcon size="small"/>
                      </IconButton>
                    </Box>
                    <Box sx={{display:'flex',flexDirection:'column',height:'93%'}}>
                      <Box 
                        sx={{
                          bgcolor: '#e3f2fd',
                          padding:'0rem 2rem 1rem 2rem',
                        }}
                      >
                        <Typography 
                          variant="h6" 
                          color="primary" 
                          gutterBottom 
                          // sx={{ fontWeight: 'bold' }}
                        >
                        {groupName}
                        {/* Total Group Balance: ₹{groupTotalAmt.toFixed(2)} */}
                        </Typography>

                        <Divider sx={{ mb: 2 }} />

                        <Stack spacing={1}>
                          {splitBalance.length === 0 ? (
                            <Typography variant="body2" color="text.secondary">
                              No pending balances. All settled! ✅
                            </Typography>
                          ) : (
                            splitBalance.map((balance, index) => (
                                <Typography 
                                  key={index}
                                  variant="body2" 
                                  sx={{ fontSize: '12px', color: '#333' }}
                                >
                                  <strong>{balance.from}</strong> owes <strong>{balance.to}</strong> 
                                  <span style={{ color: '#d32f2f', marginLeft: 5 }}>
                                    ₹{balance.amount.toFixed(2)}
                                  </span>
                                </Typography>
                            ))
                          )}
                        </Stack>
                        <Box sx={{display:'flex',justifyContent:'end'}}>
                          <Button onClick={()=>dispatch(setViewType("balances"))}>Balance</Button>
                          <Button onClick={()=>dispatch(setViewType("group_members"))}>View Members</Button>
                        </Box>
                      </Box>
                      <Box sx={{ pr: 1,overflowY: 'scroll'}}>
                        <List sx={{ width: '100%', bgcolor: 'background.paper',paddingBottom:'4rem' }}>
                          {expense.map((expense) => {
                            let lent_borrowed_amt = 0;
                            const userEntry = expense.splitBetweenWithAmt.find(
                              (entry) => entry.user._id === user.id || entry.user._id.toString() === user.id
                            );
                            if (expense.paidBy._id === user.id || expense.paidBy === user.id) {
                              lent_borrowed_amt = parseFloat((expense.amount - userEntry.amount).toFixed(2));
                            } else {
                              lent_borrowed_amt = parseFloat(userEntry.amount.toFixed(2));
                            }
                            const dateOnly = dayjs(expense.date).format('YYYY-MM-DD');
                            return (
                              <ListItem key={expense._id}>
                                <ListItemButton sx={{ padding: '0px' }} 
                                  component={Link}
                                  to={`/expenseDetails/${expense._id}`}
                                  >
                                  <Box sx={{ m: '0rem .5rem', textAlign: 'right' }}>
                                    <p style={{ margin: '0px', fontSize: '14px' }}>
                                      {dayjs(expense.date).format('MMM')} <br /> <span>{dayjs(expense.date).format('D')}</span>
                                    </p>
                                  </Box>
                                  <ListItemAvatar>
                                    <Avatar sx={{ borderRadius: '0' }}>
                                      <ShoppingBagIcon />
                                    </Avatar>
                                  </ListItemAvatar>
                                  <ListItemText
                                    primary={expense.description}
                                    secondary={`${expense.paidBy._id === user.id ? 'You' : expense.paidBy.name} paid ₹${expense.amount}`}
                                  />
                                  <ListItemText
                                    sx={{ textAlign: 'right', paddingRight: '1rem' }}
                                    primary={
                                      <Typography variant="subtitle2" sx={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'green' }}>
                                        {expense.paidBy._id === user.id ? 'You lent' : 'You borrowed'}
                                      </Typography>
                                    }
                                    secondary={
                                      <Typography variant="body2" sx={{ fontSize: '0.85rem', color: 'gray' }}>
                                        ₹{lent_borrowed_amt}
                                      </Typography>
                                    }
                                  />
                                </ListItemButton>
                              </ListItem>
                            );
                          })}
                        </List>
                      </Box>
                    </Box>
                    <Fab
                      onClick={() => addExpenseHandler('ADD_EXPENSE')}
                      color="primary"
                      aria-label="Add Expenses"
                      variant="extended"
                      sx={{
                        position: 'absolute',
                        bottom: {xs:70,sm:20},
                        right: 16,
                        zIndex: 10,
                        width:{xs:'1rem',md:'10rem'}
                      }}
                    >
                      <AddIcon />
                      <Typography sx={{display:{xs:'none',md:'block'}}}>Add Expenses</Typography>
                    </Fab>
                  </Box>      
  )
}

export default Expenses