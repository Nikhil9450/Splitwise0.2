import React from 'react'
import DataTable from '../Datatable'
import { useState } from 'react'
import { useEffect } from 'react'
import { toast,ToastContainer } from 'react-toastify'
import axios from 'axios'
const AdminDashboard = () => {
    const [users,setUsers]=useState(null)
    const [modifiedUsers,setModifiedUsers]=useState(null)
    const fetchAllUsers = async()=>{
        alert("function triggered.")
        try{
            const AllUsers = await axios.get("http://localhost:5000/admin/fetchAllUsers",{withCredentials:true});
            console.log("list of users------>",AllUsers);
            setUsers(AllUsers.data);
        }catch(error){
            console.log("error in fetching users-->",error)
            toast.error(error.response.data.error); 
        }
    }
    useEffect(()=>{
        fetchAllUsers();
    },[])

    useEffect(()=>{
       const user=  users?.map((item)=>({
           'ID':item._id,
           'Name':item.name,
           'Email':item.email,
           'Role':item.role,
           'Created Date':item.createdAt,
           'Updated Date':item.updatedAt,
         }))
        setModifiedUsers(user); 
    },[users])

  return (
    <div>AdminDashboard
      {(!users)?'': <DataTable data={modifiedUsers}/>} 
      <ToastContainer /> 
    </div>
  )
}

export default AdminDashboard