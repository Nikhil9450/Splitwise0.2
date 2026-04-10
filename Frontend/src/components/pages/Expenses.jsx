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
import { fetchGroupById } from '../../redux/userGroups/userGroupsSlice';
const Expenses = () => {
  const {user} =useSelector((state)=>state.auth);
  const {expense,expenseDetail}=useSelector((state)=>state.expenses);
  const [groupMemberList,SetGroupMemberList]=useState([]);
  // const [groupId,SetGroupId]=useState(null);
  const {GroupDetails,UserGroupList} = useSelector((state)=>state.userGroups);
  const [selectedGroup,setSelectedGroup]= useState("");
  const [expense_details,setExpense_details]=useState({});
  const [expense_container,setExpense_container] = useState(false);
  const [splitBalance,setSplitBalance]= useState([]);
  const [groupTotalAmt,setGroupTotalAmt]=useState(0);
  const [viewMembers,setViewMembers]=useState(false);
  // const [viewType,setViewType]=useState("groups");
  const [groupName,setGroupName]=useState("");
  const [balances,setBalances]=useState([]);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { id: groupId } = useParams();

  const styles = {
    fontFamily: "Montserrat, sans-serif",
     bgcolor: '#25291C'
  };

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
    console.log("GroupDetails from Expenses.jsx---------->",GroupDetails);
    setGroupName(GroupDetails?.name);
    SetGroupMemberList(GroupDetails?.members);
  },[GroupDetails])

  useEffect(()=>{
    console.log("group member list---------->",groupMemberList)
  },[groupMemberList])

  useEffect(()=>{
    console.log("groupId inside useEffect---------->",groupId);
    dispatch(fetchGroupExpenses(groupId));
    dispatch(fetchGroupById(groupId));
  },[])


useEffect(() => {
  console.log("expense or groupMemberList changed, recalculating balances...")
  if (!expense || expense.length === 0) return;

  const balances = {};
  let totalBalance = 0;
  console.log("inside expense useEffect---------->",expense);
  // Step 1: Build balances map
  expense.forEach((exp) => {
    exp.splitBetweenWithAmt.forEach((split) => {
      const from = split.user.name;
      const to = split.owesTo.name;
      const amount = split.amount;

      if (from === to) return;

      totalBalance += amount;

      if (!balances[from]) balances[from] = {};
      balances[from][to] = (balances[from][to] || 0) + amount;
    });
  });


  setGroupTotalAmt(Number(totalBalance.toFixed(2)));
  console.log("balances ----------->", balances);
  setBalances(balances);
  // Step 2: Build flat list with names
  const flatBalances = [];
  console.log("group member list inside -------->",groupMemberList)
  for (const fromId in balances) {
    for (const toId in balances[fromId]) {
      const fromUser =
        groupMemberList?.find((u) => u._id === fromId)?.name || fromId;

      const toUser =
        groupMemberList?.find((u) => u._id === toId)?.name || toId;

      flatBalances.push({
        from: fromUser,
        to: toUser,
        amount: Number(balances[fromId][toId].toFixed(2)),
      });
    }
  }

  console.log("flatBalances ----------->", flatBalances);

  // Step 3: Net mutual balances
  const netMap = {};

  flatBalances.forEach(({ from, to, amount }) => {
    const key = `${from}->${to}`;
    const reverseKey = `${to}->${from}`;

    if (netMap[reverseKey]) {
      const diff = netMap[reverseKey] - amount;

      if (diff > 0) {
        netMap[reverseKey] = diff;
      } else if (diff < 0) {
        netMap[key] = -diff;
        delete netMap[reverseKey];
      } else {
        delete netMap[reverseKey];
      }
    } else {
      netMap[key] = (netMap[key] || 0) + amount;
    }
  });

  const reducedBalances = Object.entries(netMap).map(([key, amount]) => {
    const [from, to] = key.split("->");
    return { from, to, amount };
  });

  console.log("reducedBalances ----------->", reducedBalances);

  setSplitBalance(reducedBalances);

}, [expense, groupMemberList, user.id]);


  console.log("expense in expenses",expense)
  return (
    <Box sx={{  height: '100%' }} style={styles}>
                    <Box sx={{display:'flex',justifyContent:'space-between',height:'7%', bgcolor: '#25291C',border:'none',padding:'2rem'}}>
                      <Typography 
                          variant="h6" 
                          color="#009F93" 
                          gutterBottom 
                          sx={{ fontFamily: "Montserrat, sans-serif", fontWeight: 500, fontStyle: "normal" , mt:0, mb:0, lineHeight:0 }}
                        >
                        {groupName}
                        {/* Total Group Balance: ₹{groupTotalAmt.toFixed(2)} */}
                      </Typography>
                      <IconButton aria-label="close" size="small" onClick={()=>navigate(-1)} >
                        <ArrowBackIcon size="small" sx={{color:'#DFE0DC'}}/>
                      </IconButton>
                    </Box>
                    <Box sx={{display:'flex',flexDirection:'column',height:'93%',bgcolor:'#DFE0DC',border:'none'}}>
                      <Box 
                        sx={{
                          bgcolor: '#25291C',
                          padding:'2rem 2rem 1rem 2rem',
                          // borderRadius:'0 0 2rem 2rem',
                        }}
                      >

                        <Stack spacing={1}>
                          {splitBalance.length === 0 ? (
                            <Typography 
                              variant="body2" 
                              color="text.secondary"
                              sx={{ fontFamily: "Montserrat, sans-serif", fontWeight: 500, fontStyle: "normal" }}
                              >
                              No pending balances. All settled! ✅
                            </Typography>
                          ) : (
                            splitBalance.map((balance, index) => (
                                <Typography 
                                  key={index}
                                  variant="body2" 
                                  sx={{ fontSize: '12px', color: '#DFE0DC',fontFamily: "Montserrat, sans-serif", fontWeight: 400, fontStyle: "normal"  }}
                                >
                                  <span style={{fontWeight: 500,}}>{balance.from}</span> owes <span style={{fontWeight: 500,}}>{balance.to}</span> 
                                  <span style={{ color: '#d32f2f', marginLeft: 5 }}>
                                    ₹{balance.amount.toFixed(2)}
                                  </span>
                                </Typography>
                            ))
                          )}
                        </Stack>
                        <Box sx={{display:'flex',justifyContent:'end', mt:2}}>
                          <Button 
                            // component={Link}
                            // to={`/balances/${item.id}`}                           
                            onClick={()=>dispatch(openModal({
                                            modalType: 'VIEW_BALANCES',
                                            modalProps: {
                                              title: 'Balances',
                                              groupId:groupId,
                                              groupMemberList:groupMemberList,
                                              balances:balances,
                                              expense:expense,
                                            }
                                        }))
                                      }
                            sx={{
                              color:'#DFE0DC',
                              borderRadius:'2rem',
                              border:'2px solid #DFE0DC',
                              fontSize:'0.6rem',
                              padding:'0.2rem 1rem',
                              fontFamily: "Montserrat, sans-serif",
                              }}
                          >Balance

                          </Button>
                          <Button 
                            onClick={()=>dispatch(openModal({
                                            modalType: 'VIEW_MEMBERS',
                                            modalProps: {
                                              title: 'Group Members',
                                              groupId:groupId,
                                              groupMemberList:groupMemberList,
                                            }
                                        }))
                                      }
                            sx={{
                              color:'#DFE0DC',
                              borderRadius:'2rem',
                              border:'2px solid #DFE0DC',
                              fontSize:'0.6rem',
                              padding:'0.2rem 1rem',
                              fontFamily: "Montserrat, sans-serif",
                              marginLeft:'0.5rem',
                              }}
                          >
                          Members
                          </Button>
                        </Box>
                      </Box>
                      <Box sx={{overflowY: 'scroll', marginBottom:'5rem'}}>
                        <List sx={{ width: '100%', height:'100%',padding:'12px' }}>
                          {expense.map((expense) => {
                            console.log("expense inside the map function---------->",expense);
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
                              <ListItem key={expense._id} sx={{padding:'2px', bgcolor: "#DFE0DC",border:'1.8px solid #5f5f5f', borderRadius:'2rem', marginBottom:'0.5rem'}}>
                                <ListItemButton sx={{ padding: '0px' }} 
                                  component={Link}
                                  to={`/expenseDetails/${expense._id}`}
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
                                    secondary={`${
                                      expense.paidBy._id === user.id ? "You" : expense.paidBy.name
                                    } paid ₹${expense.amount}`}
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
                                    primary={expense.paidBy._id === user.id ? 'You lent' : 'You borrowed'}
                                    secondary={`₹${lent_borrowed_amt}`}
                                    primaryTypographyProps={{
                                      sx: {
                                        fontSize: '0.7rem',
                                        color: expense.paidBy._id === user.id ? '#009F93' : '#ED6A5A',
                                        fontWeight: 600,
                                        fontFamily: "Montserrat, sans-serif",
                                      }
                                    }}
                                    secondaryTypographyProps={{
                                      sx: {
                                        fontSize: '0.9rem',
                                        color: '#25291C',
                                        fontWeight: 600
                                      }
                                    }}
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
                      aria-label="Add Expenses"
                      variant="extended"
                      sx={{
                        position: 'absolute',
                        bottom: {xs:70,sm:20},
                        right: 16,
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
  )
}

export default Expenses