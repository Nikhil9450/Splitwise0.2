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
import { Grid,Avatar,ListItemAvatar,ListItemButton,Typography } from '@mui/material';
import { openModal } from '../redux/modal/modalSlice';
import { useDispatch,useSelector } from 'react-redux';
import { fetchUserGroups } from '../redux/userGroups/userGroupsSlice';
import { fetchGroupExpenses } from '../redux/expense/expenseSlice';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
const Groups = () => {
  // const [userGroupList,SetUserGroupList]=useState([]);
  const [groupMemberList,SetGroupMemberList]=useState([]);
  const [groupId,SetGroupId]=useState(null);
  const {GroupDetails,UserGroupList} = useSelector((state)=>state.userGroups);
  const {user} =useSelector((state)=>state.auth);
  const {expense}=useSelector((state)=>state.expenses);
  const [selectedGroup,setSelectedGroup]= useState("");
  const [expense_details,setExpense_details]=useState(false)
  const dispatch = useDispatch();
  useEffect(()=>{
    // fetchgroupList();
    dispatch(fetchUserGroups());
  },[])

  useEffect(()=>{
    dispatch(fetchGroupExpenses(groupId));
  },[groupId])

  useEffect(()=>{
    console.log("expenses------------>",expense);
  },[expense])

  useEffect(()=>{
    console.log("UserGroupList from use selector-------->",UserGroupList)
  },[UserGroupList])
    const fetchgroupList =async()=>{
        try {
           const groupList = await axios.post("http://localhost:5000/group/fetchUserGroups",{},{withCredentials:true});
           console.log("groupList----------------->",groupList.data)
          //  SetUserGroupList(groupList.data)
        } catch (error) {
            console.log("error---------------->",error);
        }
    }
//  useEffect(()=>{
//    console.log("groupMemberList from group.jsx----->",groupMemberList)
//  },[groupMemberList])
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

  return (
      <Box sx={{height:'100%'}}>
         <Grid container spacing={2} sx={{height:'100%',width:'100%',flexGrow:1}}>
            <Grid size={{ xs: 12, md: 3 }}  sx={{border:'1px solid #82bdf7' ,overflowY:'scroll',height:'70vh'}}>
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
              <Grid
                item
                size={{ xs: 12, md:6}}
                sx={{
                  position: 'relative',
                  border: '1px solid #82bdf7',
                  height: '70vh',
                }}
              >
              {(expense_details)
              ?<Box sx={{  height: '100%'}}>
                 <Box sx={{ display:'flex' ,alignItems:'end',justifyContent:'end',padding:'1rem'}}>
                    <IconButton aria-label="delete" size="small" onClick={()=>setExpense_details(false)}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                 </Box>
              </Box>
              : <Box sx={{  height: '100%'}}>

                <Box sx={{ overflowY: 'scroll', height: '100%', pr: 1,paddingBottom:'3rem' }}>
                  <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
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

                      return (
                        <ListItem key={expense._id}>
                          <ListItemButton sx={{ padding: '0px' }} onClick={()=>{setExpense_details(true)}}>
                            <Box sx={{ m: '0rem .5rem', textAlign: 'right' }}>
                              <p style={{ margin: '0px', fontSize: '14px' }}>
                                Jan <br /> <span>20</span>
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
                {/* Floating Add Button */}
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
              }

            </Grid>
            <Grid size={{ xs: 12, md: 3}}  sx={{border:'1px solid #82bdf7' ,overflowY:'scroll',height:'70vh'}}>
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

      </Box>
  )
}

export default Groups