import React, { useEffect, useState } from 'react'
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
// import FormHelperText from '@mui/material/FormHelperText';
// import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import { Box } from '@mui/material';
import axios from 'axios';
const SearchAccount = () => {
    const [emailToSearch,setEmailToSearch] =useState(null)

    const searchUser =async()=>{
        console.log("emailToSearch----------->",emailToSearch);
        try{
            const user= await axios.get('http://localhost:5000/findUser',{
                params:{email:emailToSearch},
                withCredentials:true
            })
            console.log("searched user---------->", user.data); 
        }catch(error){
            console.log("error in finding user--->",error)
        }
    }
  return (
    <div>
        <Box sx={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'end',margin:'1rem'}} >
            <label>Find friends</label>
            <Box sx={{padding:'.3rem 1rem',border:'1px solid #1976d2',borderRadius:'2rem',width:'18rem',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <input type='email' placeholder='email'  style={{border:'none',background:'none',outline: 'none',fontSize:'1rem',color:'#1976d2'}} onChange={(event)=>setEmailToSearch(event.target.value)}/>
                <IconButton edge="end" sx={{bgcolor:'#1976d2',height:20,width:20,'&:hover': {bgcolor: '#115293'},}} onClick={()=>searchUser()}>
                    <SearchIcon  sx={{color:'white',fontSize:'1.2rem'}}/>
                </IconButton>
            </Box>
        </Box>
    </div>
  )
}

export default SearchAccount