import * as React from 'react';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Backdrop,
  Box,
  Modal,
  Fade,
  Button,
  Typography,
  DialogActions,
  TextField,
  InputLabel,
  InputAdornment,
  OutlinedInput,
  MenuItem,
  FormControl,
  Select,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Checkbox,
  Avatar,
} from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import AccountCircle from '@mui/icons-material/AccountCircle';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loader from './Loader';
import { closeModal } from '../redux/modal/modalSlice';
import { fetchUserGroups } from '../redux/userGroups/userGroupsSlice';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import DescriptionIcon from '@mui/icons-material/Description';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  // border: '2px solid lightgrey',
  borderRadius:'10px',
  boxShadow: 24,
  p: 4,
};

export default function TransitionsModal() {
    const { isOpen, modalType, modalProps } = useSelector((state) => state.modal);
    const {friends,sentRequests,recievedRequests} = useSelector((state)=>state.friendList)
    const {UserGroupList,GroupDetails} = useSelector((state)=>state.friendList)

    const {status,user} = useSelector((state)=>state.auth)
    
    const [selectedUser,setSelectedUser]=useState([]);
    const [groupName,setGroupName]=useState(null)
    const [selectedGroupMember,setSelectedGroupMember]=useState( modalProps?.groupMemberList?.map((member) => member._id) || [])
    const [paidBy, setPaidBy] = useState(user?.id || "");

    const [updatedUserDetails,setUpdatedUserDetails]= useState({
        name:modalProps.name,
        email:modalProps.email,
        currentPassword:"",
        newPassword:""
      })
    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const dispatch = useDispatch()
    const MenuProps = {
      PaperProps: {
        style: {
          maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
          // maxHeight: 300,
          width: 250,
        },
      },
    };

    useEffect(()=>{
      setSelectedUser (user?.id ? [user.id] : [])
    },[user])
    
    useEffect(()=>{
      console.log("modalProps.groupMemberList--------->", modalProps.groupMemberList)
      console.log( "user--------->",user)
    },[user])
    
    useEffect(() => {
      if (modalType === "EDIT_PROFILE") {
            setUpdatedUserDetails({
              name: modalProps.name || "",
              email: modalProps.email || "",
              currentPassword: "",
              newPassword: "",
            });
          }
    }, [modalType, modalProps]);

    const selectUser=(event)=>{
     const {checked,value} = event.target;

      console.log("selected user",checked,value)
      if(checked){
        setSelectedUser((prev)=>[...prev,value])
      }else{
        setSelectedUser((prev)=>[...prev].filter((id)=> id !== value ))
      }

    }

    const fetchGroupDetails=async(groupId)=>{
      try {
        const groupData=await axios.post("http://localhost:5000/group/fetchGroupData",{groupId},{withCredentials:true});
        console.log("groupData----------->",groupData)
      } catch (error) {
        console.log("error------------>",error)        
      }
    }

    const createGroup = async()=>{
      console.log(selectedUser,selectedUser.length,groupName)
      if(selectedUser.length==0 || groupName==null){
        toast.error("Please select group members and give group name.");
      }else if(selectedUser.length <= 1){
        toast.error("Please select at least 2 group members.")
      }else{
        const data ={
          groupName:groupName,
          groupMembers:selectedUser,
        }
        try {
          const groupData=await axios.post("http://localhost:5000/group/createGroup",{data},{withCredentials:true});
          console.log("groupData----------->",groupData)
          toast.success("Group created successfully.");
          setSelectedUser([user.id]);
          dispatch(closeModal());
        } catch (error) {
          console.log("error------------>",error)        
        }
      }
    }
    const updateProfile= async() =>{
      console.log("updatedUserDetails-------------->",updatedUserDetails)
      try{
        const response =await axios.post('http://localhost:5000/editUser/update',
          updatedUserDetails
        ,{
            withCredentials: true
          })
        console.log("api respose------>",response)
        dispatch(closeModal());
        toast.success("Updated successfully login again to reflect changes");
      }catch(error){
        console.log("error--------->",error);
        toast.error(error.response?.data?.error || "Something went wrong");
      }
      
    }


  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedGroupMember(
      typeof value === 'string' ? value.split(',') : value
    );
  };



    const renderModalContent = () => {

      switch (modalType) {
          case "EDIT_PROFILE":
          return (
              <>
              <Typography variant="h6">{modalProps.title}</Typography>
              <TextField
                  label="Enter Name"
                  defaultValue={modalProps.name}
                  fullWidth
                  sx={{ mt: 2 }}
                  onChange={(event)=>setUpdatedUserDetails({...updatedUserDetails,'name':event.target.value})}
              />
              <TextField
                  label="Enter Email"
                  defaultValue={modalProps.email}
                  fullWidth
                  sx={{ mt: 2 }}
                  onChange={(event)=>setUpdatedUserDetails({...updatedUserDetails,'email':event.target.value})}

              />
              <Box>
                <TextField
                    label="Enter Current Password"
                    defaultValue=""
                    fullWidth
                    type='password'
                    sx={{ mt: 2 }}
                    onChange={(event)=>setUpdatedUserDetails({...updatedUserDetails,'currentPassword':event.target.value})}

                />
                <TextField
                    label="Enter New Password"
                    defaultValue=""
                    fullWidth
                    type='password'
                    sx={{ mt: 2 }}
                    onChange={(event)=>setUpdatedUserDetails({...updatedUserDetails,'newPassword':event.target.value})}
                />            
              </Box>
              <DialogActions>
                  <Button onClick={() => dispatch(closeModal())}>Cancel</Button>
                  <Button onClick={() => updateProfile()}>Submit</Button>
              </DialogActions>
              </>
          );
          case "CREATE_GROUP":
            return (            
              <>
                <Box >
                  <Typography variant="h6" sx={{marginBottom: '1rem',fontSize:'1.2rem'}}>{modalProps.title}</Typography>
                  <TextField
                    id="filled-basic" 
                    label="Group name" 
                    variant="filled" 
                    fullWidth
                    onChange={(event)=>setGroupName(event.target.value)}
                    value={groupName}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <GroupsIcon/>
                          </InputAdornment>
                        ),
                      },
                    }}  
                    />
                  <Box>
                    <List dense sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                      {friends.map((user) => {
                        const labelId = `checkbox-list-secondary-label-${user._id}`;
                        return (
                          <ListItem
                            key={user._id}
                            secondaryAction={
                              <Checkbox
                                edge="end"
                                onChange={selectUser}
                                value={user._id}
                                checked={selectedUser.includes(user._id)}
                                inputProps={{ 'aria-labelledby': labelId }}
                              />
                            }
                            disablePadding
                          >
                            <ListItemButton>
                              <ListItemAvatar >
                                <Avatar
                                  // alt={`Avatar n°${user + 1}`}
                                  // src={`/static/images/avatar/${user + 1}.jpg`}
                                />
                              </ListItemAvatar>
                              <ListItemText id={labelId}                 
                                  primary={user.name} 
                                  secondary={user.email} 
                              />
                            </ListItemButton>
                          </ListItem>
                        );
                      })}
                    </List>
                  </Box>  
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button onClick={()=>createGroup()} variant="contained"sx={{fontSize:'12px'}} endIcon={<GroupAddIcon />}>
                      Create
                    </Button>
                  </Box>
                </Box>
              </>
            );
          case "ADD_EXPENSE":
            return (
              <>
                  <Typography variant="h6">{modalProps.title}</Typography>
                  <Box>
                  <Box >
                      <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                        <Box 
                          sx={{ 
                              display: 'flex', 
                              alignItems: 'center',
                              justifyContent:'center', 
                              padding:'.5rem',
                              border: '1px solid #82bdf7',
                              bgcolor:'#dcedff', 
                              marginRight:'.5rem'
                            }}
                          >
                          <DescriptionIcon sx={{ color: '#1976d2' }} />
                        </Box>
                        <TextField id="input-with-sx" label="Description" variant="standard" sx={{width:'100%'}}/>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                        <Box 
                          sx={{ 
                              display: 'flex', 
                              alignItems: 'center',
                              justifyContent:'center', 
                              padding:'.5rem',
                              border: '1px solid #82bdf7',
                              bgcolor:'#dcedff', 
                              marginRight:'.5rem'
                            }}                        
                          >
                          <CurrencyRupeeIcon sx={{ color: '#1976d2' }} />
                        </Box>
                        
                        <TextField id="input-with-sx" label="Amount" variant="standard" sx={{width:'100%'}}/>
                      </Box>
                    {/* <TextField id="standard-basic" label="Description" variant="standard" 
                      sx={{width:'100%'}}
                    />
                    <TextField id="standard-basic" label="Amout" variant="standard"
                      sx={{width:'100%'}} 
                    /> */}
                  </Box>
                    <Box sx={{ display:'flex',flexDirection:'row',marginTop:'1rem'}}>
                        <FormControl  sx={{ m: 1, minWidth: 120 }}  size="small">
                          <InputLabel id="demo-simple-select-standard-label">Paid By</InputLabel>
                          <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={paidBy}
                            onChange={(event)=>setPaidBy(event.target.value)}
                            label="Paid By"
                          >
                          {modalProps.groupMemberList.map((user)=> <MenuItem key={user._id} value={user._id}>{user.name}</MenuItem>)}

                          </Select>
                        </FormControl>

                        <FormControl sx={{ m: 1, width: 300 }}  size="small">
                          <InputLabel id="demo-multiple-checkbox-label">Equally</InputLabel>
                          <Select
                            labelId="demo-multiple-checkbox-label"
                            id="demo-multiple-checkbox"
                            multiple
                            value={selectedGroupMember}
                            onChange={handleChange}
                            input={<OutlinedInput label="Equally" />}
                            renderValue={(selected) =>
                                          modalProps.groupMemberList
                                            .filter((user) => selected.includes(user._id))
                                            .map((user) => user.name)
                                            .join(', ')
                                        }
                            MenuProps={MenuProps}
                          >
                            {modalProps.groupMemberList.map((user) => (
                              <MenuItem key={user._id} value={user._id}>
                                <Checkbox checked={selectedGroupMember.includes(user._id)} />
                                <ListItemText primary={user.name} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                    </Box>
                  </Box>
              </>
            );
          default:
          return null;
      }
    };

  return (
    <div>
      <Modal
        // sx={{borderRadius:'10px',border:'none'}}
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={isOpen}
        onClose={()=>dispatch(closeModal())}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={isOpen}>
            <Box sx={style}>
                {renderModalContent()}
            </Box>
        </Fade>
      </Modal>
    </div>
  );
}
