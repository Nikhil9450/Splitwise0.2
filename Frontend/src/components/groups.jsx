import React from 'react'
import axios from 'axios'
const groups = () => {
    const fetchgroupList =async()=>{
        try {
           const groupList = await axios.post("http://localhost:5000/group/fetchUserGroups",{},{withCredentials:true});
           console.log("groupList----------------->",groupList)
        } catch (error) {
            console.log("error---------------->",error);
        }
    }
  return (
    <div>
       <button onClick={()=>fetchgroupList()}>fetch group lists</button>
    </div>
  )
}

export default groups