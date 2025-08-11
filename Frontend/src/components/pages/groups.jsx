import React from 'react'
import axios from 'axios';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Box from '@mui/material/Box';
import GroupsIcon from '@mui/icons-material/Groups';
import { useEffect } from 'react';
import { useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import { Grid,Avatar,ListItemAvatar,ListItemButton,Typography, Paper, Divider,Stack  } from '@mui/material';
import { openModal } from '../../redux/modal/modalSlice';
import { useDispatch,useSelector } from 'react-redux';
import { fetchUserGroups } from '../../redux/userGroups/userGroupsSlice';
import { fetchGroupExpenses,deleteExpense } from '../../redux/expense/expenseSlice';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import dayjs from 'dayjs';
import DeleteIcon from '@mui/icons-material/Delete';
const Groups = () => {
  // const [userGroupList,SetUserGroupList]=useState([]);
  const [groupMemberList,SetGroupMemberList]=useState([]);
  const [groupId,SetGroupId]=useState(null);
  const {GroupDetails,UserGroupList} = useSelector((state)=>state.userGroups);
  const {user} =useSelector((state)=>state.auth);
  const {expense}=useSelector((state)=>state.expenses);
  const [selectedGroup,setSelectedGroup]= useState("");
  const [expense_details,setExpense_details]=useState({});
  const [expense_container,setExpense_container] = useState(false);
  const [splitBalance,setSplitBalance]= useState([]);
  const [groupTotalAmt,setGroupTotalAmt]=useState(0);
  const [viewMembers,setViewMembers]=useState(false);
  const [viewType,setViewType]=useState("groups");
  const [groupName,setGroupName]=useState("");
  const dispatch = useDispatch();
  useEffect(()=>{
    // fetchgroupList();
    dispatch(fetchUserGroups());
  },[])

  useEffect(()=>{
    dispatch(fetchGroupExpenses(groupId));
  },[groupId])

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

  useEffect(()=>{
    console.log("UserGroupList from use selector-------->",UserGroupList)
  },[UserGroupList])

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
    const editExpenseHandler =()=>{
        console.log("expense_details--------->",expense_details);
        dispatch(openModal({
                      modalType: 'ADD_EXPENSE',
                      modalProps: {
                        title: 'Edit Expense',
                        groupId:groupId,
                        groupMemberList:groupMemberList,
                        expenseDetail: expense_details,
                      }
        }))
        setExpense_container(false);
    }
    const deleteExpenseHandler=()=>{
        dispatch(openModal({
                    modalType: 'DELETE_EXPENSE',
                    modalProps: {
                      title: 'Delete Expense',
                      expenseId: expense_details._id,
                      groupId:groupId,
                    }
          }))
        setExpense_container(false);

    }

    const renderGroupElementsInMobileView =(viewType)=>{
      switch(viewType){
        case 'groups':
          return  <Box>
                    <List
                          sx={{
                            width: '100%',
                            // maxWidth: 360,
                            bgcolor: 'background.paper',
                            position: 'relative',
                            overflow: 'auto',
                            // maxHeight: 300,
                            height:'100%',
                            paddingBottom:0,
                            '& ul': { padding: 0 },
                          }}
                          subheader={<li />}
                        >
                          <ListSubheader sx={{bgcolor:'#1976d2',color:'white',marginBottom:'.5rem'}}>Groups</ListSubheader>
                            <li >
                                <ul>
                                  {UserGroupList.map((item) => (
                                    <ListItem key={item.id}>
                                      {/* <ListItemText primary={item.name} /> */}
                                      <Button 
                                        variant={(selectedGroup==item.id)?"outlined":"text"} 
                                        sx={{width:'100%',justifyContent:'start',bgcolor:'#dcedff'}} 
                                        onClick={()=>{
                                          SetGroupMemberList(item.members);
                                          SetGroupId(item.id);
                                          setSelectedGroup(item.id);
                                          setViewType("expenses");
                                          setGroupName(item.name);
                                        }} 
                                        startIcon={<GroupsIcon sx={{marginLeft:'.5rem',marginRight:'1rem'}}/>}>{item.name}
                                      </Button>
                                    </ListItem>
                                  ))}
                                </ul>
                            </li>
                    </List>
                  </Box>
        case 'expenses':
          return  <Box sx={{  height: '100%'}}>
                    <Box sx={{display:'flex',justifyContent:'end',height:'7%', bgcolor: '#e3f2fd',}}>
                      <IconButton aria-label="close" size="small" onClick={()=>{setSelectedGroup(""); setViewType("groups")}} sx={{padding:'2rem'}}>
                        <CloseIcon size="small"/>
                      </IconButton>
                    </Box>
                    <Box sx={{display:'flex',flexDirection:'column',height:'93%'}}>
                      <Box 
                        sx={{
                          bgcolor: '#e3f2fd',
                          padding:'0rem 2rem 1rem 2rem',
                          // width:'40%'
                          // boxShadow: 3,
                          // minHeight: '20%',
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
                          <Button onClick={()=>setViewType("balances")}>Balance</Button>
                          <Button onClick={()=>setViewType("group_members")}>View Members</Button>
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
                                <ListItemButton sx={{ padding: '0px' }} onClick={()=>{
                                  setExpense_details(expense);
                                  setExpense_container(true);
                                  setViewType("expense_details");
                                  }}>
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
        case 'expense_details':
          return  <Box
                    component={Paper}
                    // elevation={3}
                    sx={{
                      p: 3,
                      width: '100%',
                      height:'100%',
                      mx: 'auto',
                      // bgcolor: 'background.paper',
                      // position: 'relative',
                    }}
                  >
                    <Box sx={{display:'flex',justifyContent:'end',marginBottom:'1rem'}}>
                      <IconButton aria-label="close" size="small" onClick={()=>{setExpense_container(false); setViewType("expenses")}} >
                        <CloseIcon size="small"/>
                      </IconButton>
                    </Box>
                    {/* Expense Details */}
                    <Typography variant="h5" fontWeight={500} gutterBottom>
                      {(expense_details.description).toUpperCase()}
                    </Typography>

                    <Typography variant="h4" color="primary" gutterBottom>
                      ₹{expense_details.amount}
                    </Typography>

                    <Divider sx={{ mb: 2 }} />

                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Added by <strong>{expense_details.addedBy.name}</strong> on <strong>{dayjs(expense_details.date).format('YYYY-MM-DD')}</strong>
                    </Typography>

                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <strong>{expense_details.paidBy.name}</strong> paid ₹{expense_details.amount}
                    </Typography>
                    <Divider sx={{ my: 2 }} />

                    {/* Split Details */}
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                      Split Details:
                    </Typography>

                    {expense_details.splitBetweenWithAmt.map((member, idx) => (
                      <Typography
                        key={idx}
                        variant="body2"
                        color="text.secondary"
                        sx={{ pl: 1 }}
                      >
                        {member.user.name} owes ₹{(member.amount).toFixed(2)}
                      </Typography>
                    ))}
                    <Box sx={{display:'flex',justifyContent:'space-evenly'}}>
                      <Button
                        size="small"
                        onClick={() => deleteExpenseHandler()}
                      >
                        <DeleteIcon fontSize="small" sx={{mr:'.5rem'}}/>  DELETE EXPENSE 
                      </Button>
                      <Button
                        size="small"
                        onClick={() => editExpenseHandler()}
                      >
                        <EditIcon fontSize="small" sx={{mr:'.5rem'}} /> EDIT EXPENSE  
                      </Button>
                    </Box>
                  </Box> 
        case 'group_members':
          return  <Box>
                      <Box sx={{display:'flex',justifyContent:'end',height:'10%', bgcolor: '#e3f2fd',}}>
                        <IconButton aria-label="close" size="small" onClick={()=>{ setViewType("expenses")}} sx={{padding:'1rem'}}>
                          <CloseIcon size="small"/>
                        </IconButton>
                      </Box>
                      <List
                        sx={{
                          width: '100%',
                          // maxWidth: 360,
                          bgcolor: 'background.paper',
                          position: 'relative',
                          overflow: 'auto',
                          // maxHeight: 300,
                          height:'100%',
                          paddingBottom:0,
                          '& ul': { padding: 0 },
                        }}
                        subheader={<li />}
                      >
                        {/* <ListSubheader sx={{bgcolor:'#1976d2',color:'white',marginBottom:'.5rem'}}>Group Members</ListSubheader> */}
                          <li >
                              <ul>
                                {groupMemberList.map((member) => (
                                    
                                  <ListItem key={member._id} sx={{padding:'0px 10px'}}>
                                  <ListItemAvatar sx={{minWidth:'40px'}}>
                                    <Avatar
                                      sx={{ width: 30, height: 30 }}
                                    />
                                  </ListItemAvatar>
                                    <ListItemText 
                                    primary={member.name} 
                                    secondary={member.email}
                                    slotProps={{
                                        primary: {
                                        sx: { fontSize: '13px', fontWeight: 'bold',color:'#636262' },
                                        },
                                        secondary: {
                                        sx: { fontSize: '0.85rem', color: 'text.secondary' ,fontSize:'12px'},
                                        },
                                    }}
                                    />
                                    {/* <Button variant="text" sx={{width:'100%',justifyContent:'start',bgcolor:'#dcedff'}} startIcon={<GroupsIcon sx={{marginLeft:'.5rem',marginRight:'1rem'}}/>} >{item.name}</Button> */}
                                  </ListItem>
                                ))}
                              </ul>
                          </li>
                      </List>
                  </Box>
        case 'balances':
          return  <Box>
                    <Box sx={{display:'flex',justifyContent:'end',height:'7%', bgcolor: '#e3f2fd',}}>
                      <IconButton aria-label="close" size="small" onClick={()=>{setViewType("expenses")}} sx={{padding:'2rem'}}>
                        <CloseIcon size="small"/>
                      </IconButton>
                    </Box>
                  </Box>
      }
    }
  return (
      <Box sx={{height:'100%'}}>
         <Grid container spacing={2} sx={{height:'100%',width:'100%',flexGrow:1, display:{xs:'none',md:'flex'}}}>
            <Grid size={{ xs: 12, md: 3 }}  sx={{border:'1px solid #82bdf7' ,overflowY:'scroll',height:'100%'}}>
              <List
                    sx={{
                      width: '100%',
                      // maxWidth: 360,
                      bgcolor: 'background.paper',
                      position: 'relative',
                      overflow: 'auto',
                      // maxHeight: 300,
                      height:'100%',
                      paddingBottom:0,
                      '& ul': { padding: 0 },
                    }}
                    subheader={<li />}
                  >
                    <ListSubheader sx={{bgcolor:'#1976d2',color:'white',marginBottom:'.5rem'}}>Groups</ListSubheader>
                      <li >
                          <ul>
                            {UserGroupList.map((item) => (
                              <ListItem key={item.id}>
                                {/* <ListItemText primary={item.name} /> */}
                                <Button 
                                  variant={(selectedGroup==item.id)?"outlined":"text"} 
                                  sx={{width:'100%',justifyContent:'start',bgcolor:'#dcedff'}} 
                                  onClick={()=>{
                                    SetGroupMemberList(item.members);
                                    SetGroupId(item.id);
                                    setSelectedGroup(item.id)
                                  }} 
                                  startIcon={<GroupsIcon sx={{marginLeft:'.5rem',marginRight:'1rem'}}/>}>{item.name}
                                </Button>
                              </ListItem>
                            ))}
                          </ul>
                      </li>
              </List>
            </Grid>
            <Grid item size={{ xs: 12, md:6}} sx={{ position: 'relative', border: '1px solid #82bdf7', height: '100%',}}>
              {(expense_container)
              ?<Box
                  component={Paper}
                  // elevation={3}
                  sx={{
                    p: 3,
                    width: '100%',
                    height:'100%',
                    mx: 'auto',
                    // bgcolor: 'background.paper',
                    position: 'relative',
                  }}
                >
                  {/* Close Button */}
                  <IconButton
                    aria-label="close"
                    size="small"
                    onClick={() => setExpense_container(false)}
                    sx={{ position: 'absolute', top: 8, right: 8 }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>

                  {/* Expense Details */}
                  <Typography variant="h5" fontWeight={500} gutterBottom>
                    {(expense_details.description).toUpperCase()}
                  </Typography>

                  <Typography variant="h4" color="primary" gutterBottom>
                    ₹{expense_details.amount}
                  </Typography>

                  <Divider sx={{ mb: 2 }} />

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Added by <strong>{expense_details.addedBy.name}</strong> on <strong>{dayjs(expense_details.date).format('YYYY-MM-DD')}</strong>
                  </Typography>

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>{expense_details.paidBy.name}</strong> paid ₹{expense_details.amount}
                  </Typography>
                  <Divider sx={{ my: 2 }} />

                  {/* Split Details */}
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Split Details:
                  </Typography>

                  {expense_details.splitBetweenWithAmt.map((member, idx) => (
                    <Typography
                      key={idx}
                      variant="body2"
                      color="text.secondary"
                      sx={{ pl: 1 }}
                    >
                      {member.user.name} owes ₹{(member.amount).toFixed(2)}
                    </Typography>
                  ))}
                  <IconButton
                    aria-label="close"
                    size="small"
                    onClick={() => deleteExpenseHandler()}
                    sx={{ position: 'absolute', bottom: 40, right: 80 }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    aria-label="close"
                    size="small"
                    onClick={() => editExpenseHandler()}
                    sx={{ position: 'absolute', bottom: 40, right: 40 }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
              </Box>
              : (selectedGroup)
                ?<Box sx={{  height: '100%'}}>
                  <Box sx={{display:'flex',height: '100%'}}>
                    <Box 
                      sx={{
                        bgcolor: '#e3f2fd',
                        p: 3,
                        height:'100%',
                        width:'40%'
                        // boxShadow: 3,
                        // minHeight: '20%',
                      }}
                    >
                      <Typography 
                        variant="h6" 
                        color="primary" 
                        gutterBottom 
                        // sx={{ fontWeight: 'bold' }}
                      >
                      Total Group Balance: ₹{groupTotalAmt.toFixed(2)}
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
                    </Box>
                    <Box sx={{ height: '100%', width:'60%', pr: 1,overflowY: 'scroll' }}>
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
                              <ListItemButton sx={{ padding: '0px' }} onClick={()=>{
                                setExpense_details(expense);
                                setExpense_container(true);
                                }}>
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
                      bottom: 16,
                      right: 16,
                      zIndex: 10,
                    }}
                  >
                    <AddIcon />
                    Add Expenses
                  </Fab>
                </Box>
                :<Box sx={{  height: '100%',display:'flex',justifyContent:'center',alignItems:"center"}}>
                    <Typography> Select Group to view expense. </Typography>
                </Box> 
              }
            </Grid>
            <Grid size={{ xs: 12, md: 3}}  sx={{border:'1px solid #82bdf7' ,overflowY:'scroll',height:'100%'}}>
              <List
                    sx={{
                      width: '100%',
                      // maxWidth: 360,
                      bgcolor: 'background.paper',
                      position: 'relative',
                      overflow: 'auto',
                      // maxHeight: 300,
                      height:'100%',
                      paddingBottom:0,
                      '& ul': { padding: 0 },
                    }}
                    subheader={<li />}
                  >
                    <ListSubheader sx={{bgcolor:'#1976d2',color:'white',marginBottom:'.5rem'}}>Group Members</ListSubheader>
                      <li >
                          <ul>
                            {groupMemberList.map((member) => (
                                
                              <ListItem key={member._id} sx={{padding:'0px 10px'}}>
                              <ListItemAvatar sx={{minWidth:'40px'}}>
                                <Avatar
                                  sx={{ width: 30, height: 30 }}
                                />
                              </ListItemAvatar>
                                <ListItemText 
                                primary={member.name} 
                                secondary={member.email}
                                slotProps={{
                                    primary: {
                                    sx: { fontSize: '13px', fontWeight: 'bold',color:'#636262' },
                                    },
                                    secondary: {
                                    sx: { fontSize: '0.85rem', color: 'text.secondary' ,fontSize:'12px'},
                                    },
                                }}
                                />
                                {/* <Button variant="text" sx={{width:'100%',justifyContent:'start',bgcolor:'#dcedff'}} startIcon={<GroupsIcon sx={{marginLeft:'.5rem',marginRight:'1rem'}}/>} >{item.name}</Button> */}
                              </ListItem>
                            ))}
                          </ul>
                      </li>
              </List>
            </Grid>
         </Grid>
         {/* mobile view */}
         <Grid sx={{display:{xs:'block',md:'none'},height:'100vh'}}>
            {renderGroupElementsInMobileView(viewType)}
         </Grid>
      </Box>
  )
}

export default Groups