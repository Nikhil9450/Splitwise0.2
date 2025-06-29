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
import { Grid,Avatar,ListItemAvatar } from '@mui/material';
import { openModal } from '../redux/modal/modalSlice';
import { useDispatch,useSelector } from 'react-redux';
import { fetchUserGroups } from '../redux/userGroups/userGroupsSlice';
const Groups = () => {
  // const [userGroupList,SetUserGroupList]=useState([]);
  const [groupMemberList,SetGroupMemberList]=useState([]);
  const [groupId,SetGroupId]=useState(null);
  const {GroupDetails,UserGroupList} = useSelector((state)=>state.userGroups);
  const [selectedGroup,setSelectedGroup]= useState("");
  const dispatch = useDispatch();
  useEffect(()=>{
    // fetchgroupList();
    dispatch(fetchUserGroups());
  },[])
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
         <Grid container spacing={2} size="grow" sx={{height:'100%'}}>
            <Grid size={{ xs: 12, md: 3 }}  sx={{border:'1px solid #82bdf7'}}>
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
            <Grid size={{ xs: 12, md: 6 }}  sx={{border:'1px solid #82bdf7'}}>
             <Button primary onClick={()=>addExpenseHandler("ADD_EXPENSE")}>Add Expenses</Button>
            </Grid>
            <Grid size={{ xs: 12, md: 3}}  sx={{border:'1px solid #82bdf7'}}>
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