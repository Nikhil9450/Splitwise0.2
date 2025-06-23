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
import { Grid } from '@mui/material';
const Groups = () => {
  const [userGroupList,SetUserGroupList]=useState([]);

  useEffect(()=>{
    fetchgroupList();
  },[])
    const fetchgroupList =async()=>{
        try {
           const groupList = await axios.post("http://localhost:5000/group/fetchUserGroups",{},{withCredentials:true});
           console.log("groupList----------------->",groupList.data)
           SetUserGroupList(groupList.data)
        } catch (error) {
            console.log("error---------------->",error);
        }
    }
    // const buttons = [
    //   <Button key="one" startIcon={<GroupsIcon />}>group name</Button>,
    // ];
    // const buttons = userGroupList.map((group)=>{
    //   return <Button key={group.id} startIcon={<GroupsIcon />}>{group.name}</Button>
    // })
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
                            {userGroupList.map((item) => (
                              <ListItem key={item.id}>
                                {/* <ListItemText primary={item.name} /> */}
                                <Button variant="text" sx={{width:'100%',justifyContent:'start',bgcolor:'#dcedff'}} startIcon={<GroupsIcon sx={{marginLeft:'.5rem',marginRight:'1rem'}}/>}>{item.name}</Button>
                              </ListItem>
                            ))}
                          </ul>
                      </li>
              </List>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}  sx={{border:'1px solid #82bdf7'}}>

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
                            {userGroupList.map((item) => (
                              <ListItem key={item.id}>
                                {/* <ListItemText primary={item.name} /> */}
                                <Button variant="text" sx={{width:'100%',justifyContent:'start',bgcolor:'#dcedff'}} startIcon={<GroupsIcon sx={{marginLeft:'.5rem',marginRight:'1rem'}}/>}>{item.name}</Button>
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