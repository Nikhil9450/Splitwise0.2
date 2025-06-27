import * as React from 'react';
import { useState, useEffect,useRef } from 'react';
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
import ButtonGroup from '@mui/material/ButtonGroup';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';

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
    const [selectedGroupMember,setSelectedGroupMember]=useState([])
    const [paidBy, setPaidBy] = useState("");
    const [splitType,setSplitType]=useState("Equally");
    const [splitContainer,setSplitContainer]=useState(false)
    const [updatedUserDetails,setUpdatedUserDetails]= useState({
        name:modalProps.name,
        email:modalProps.email,
        currentPassword:"",
        newPassword:""
      })
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [splitByAmount,setSplitByAmount]=useState({});
    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const dispatch = useDispatch()
    const MenuProps = {
      PaperProps: {
        style: {
          maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
          // maxHeight: 300,
          width: 180,
        },
      },
    };

  // const resetUnequallyAmt =()=>{
  //     if (modalProps?.groupMemberList?.length) {
  //     const initialSplit = modalProps.groupMemberList.reduce((acc, user) => {
  //       acc[user._id] = 0;
  //       return acc;
  //     }, {});
  //   setSplitByAmount(initialSplit);
  // }

useEffect(() => {
  if (modalProps?.groupMemberList?.length) {
    const initialSplit = modalProps.groupMemberList.reduce((acc, user) => {
      acc[user._id] = 0;
      return acc;
    }, {});
    setSplitByAmount(initialSplit);
  }
}, [modalProps.groupMemberList]);

    useEffect(()=>{
      console.log("splitByAmount----------->",splitByAmount)
    },[splitByAmount])

    useEffect(()=>{
      setSelectedUser (user?.id ? [user.id] : [])
    },[user])
    
    useEffect(() => {
      if (modalProps?.groupMemberList) {
        setSelectedGroupMember(modalProps.groupMemberList.map((member) => member._id));
      }
      if(user){
        setPaidBy(user.id)
      }
    }, [modalProps?.groupMemberList,user]);
    
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
     const {checked,value} = event.target;

      console.log("selected user",checked,value)
      if(checked){
        setSelectedGroupMember((prev)=>[...prev,value])
      }else{
        setSelectedGroupMember((prev)=>[...prev].filter((id)=> id !== value ))
      }
    };

    const splitTypeHandler=(type)=>{
      setSplitType(type);
      setSplitContainer(true);
    }

    const renderSplitType=()=>{
      if(splitType=='Equally'){
        return(
          <>
            <Typography variant="h6">Split equally</Typography>
            <List dense sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
              {modalProps.groupMemberList.map((user) => {
                const labelId = `checkbox-list-secondary-label-${user._id}`;
                return (
                  <ListItem
                      key={user._id}
                      secondaryAction={
                        <Checkbox
                          edge="end"
                          onChange={handleChange}
                          value={user._id}
                          checked={selectedGroupMember.includes(user._id)}
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      }
                      disablePadding
                    >
                      <ListItemText id={labelId}                 
                        primary={user.name} 
                        secondary={user.email}
                        sx={{
                          '& .MuiListItemText-secondary': {
                            fontSize: '11px',
                            color: 'gray',
                          },                      
                        }}                            
                        />
                    </ListItem>
                );
              })}
            </List>
            <Box sx={{display:'flex',justifyContent:'end',marginTop:'2rem'}}>

              <Button variant='outlined'  startIcon={<SaveIcon />} 
                  onClick={()=>save("Equally")}
              > 
                Save
              </Button>
            </Box>  
          </>
        )
      }else if(splitType=='Unequally'){
        return (
          <>
            <Typography variant="h6">Split by exact amount</Typography>
            <List dense sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
              {modalProps.groupMemberList.map((user) => {
                const labelId = `checkbox-list-secondary-label-${user._id}`;
                return (
                  <ListItem
                    key={user._id}
                    secondaryAction={
                      <TextField id="standard-basic" label="₹" variant="standard" size="small" sx={{width:'2rem'}} onChange={(e)=>{setSplitByAmount((prev)=>({...prev,[user._id]:e.target.value}))}} />
                    }
                    disablePadding
                  >

                      <ListItemText id={labelId}                 
                          primary={user.name} 
                          secondary={user.email} 
                              sx={{
                                '& .MuiListItemText-secondary': {
                                  fontSize: '11px',
                                  color: 'gray',
                                },                      
                              }}                       
                      />
                  </ListItem>
                );
              })}
            </List>
            <Box sx={{display:'flex',justifyContent:'end',marginTop:'2rem'}}>
              <Button variant='outlined' color="error"
                  onClick={()=>setSplitContainer(false)}
                  sx={{mr:1}}
              > 
                Cancel
              </Button>
              <Button variant='outlined'  startIcon={<SaveIcon />} 
                  onClick={()=>save("Unequally")}
              > 
                Save
              </Button>
            </Box>              
          </>
        )
      }
    }

    const addExpense =()=>{
      console.log("description,amount---------->",description,amount);
    }

    const save=(type)=>{
      if(type==="Equally"){
        if(selectedGroupMember.length===0){
          toast.error("Please select at least one member.")
        }else{
          setSplitContainer(false);
        }
      }else if(type==="Unequally"){
            
      }
    }
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
              {splitContainer
              ? <>
                {renderSplitType()}
              </>
              :<>
                <Typography variant="h6" sx={{marginBottom:'2rem'}} >{modalProps.title}</Typography>
                  <Box>
                    <Box >
                        <Box sx={{ display: 'flex', alignItems: 'flex-end', marginBottom:'1rem' }}>
                          <Box 
                            sx={{ 
                                display: 'flex', 
                                alignItems: 'center',
                                justifyContent:'center', 
                                padding:'.5rem',
                                border: '1px solid #82bdf7',
                                bgcolor:'#dcedff', 
                                marginRight:'.6rem',
                                borderRadius:'.5rem'
                              }}
                            >
                            <DescriptionIcon sx={{ color: '#1976d2' }} />
                          </Box>
                          <TextField id="input-with-sx" label="Description" variant="standard" sx={{width:'100%'}} size="small" onChange={(e) => setDescription(e.target.value)} />
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
                                marginRight:'.6rem',
                                borderRadius:'.5rem',
                              }}                        
                            >
                            <CurrencyRupeeIcon sx={{ color: '#1976d2' }} />
                          </Box>
                          <TextField id="input-with-sx" type="number" label="Amount" variant="standard" sx={{width:'100%'}} size="small" onChange={(e)=>setAmount(e.target.value)} />
                        </Box>
                    </Box>
                    <Box sx={{ display:'flex',flexDirection:'row',marginTop:'3rem'}}>
                        <FormControl  sx={{ mr: 1, minWidth: 120 }}  size="small">
                          <InputLabel id="demo-simple-select-standard-label" sx={{fontSize:'14px'}}>Paid By</InputLabel>
                          <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            sx={{fontSize:'smaller'}}
                            value={paidBy}
                            onChange={(event)=>setPaidBy(event.target.value)}
                            label="Paid By"
                          >
                          {modalProps.groupMemberList.map((user)=> <MenuItem sx={{fontSize:'smaller'}} key={user._id} value={user._id}>{user.name}</MenuItem>)}

                          </Select>
                        </FormControl>

      
                          <ButtonGroup
                            disableElevation
                            variant="outlined"
                            aria-label="Disabled button group"
                            size='small'
                          >
                            <Button  variant={(splitType=="Equally")?"contained":"outlined"} onClick={()=>splitTypeHandler("Equally")}>Equally</Button>
                            <Button  variant={(splitType=="Unequally")?"contained":"outlined"} onClick={()=>splitTypeHandler("Unequally")}>Unequally</Button>
                          </ButtonGroup>
                    </Box>
                  </Box>
                  <Box sx={{display:'flex',justifyContent:'end',marginTop:'2rem'}} >
                    <Button variant='contained' startIcon={<AddIcon />} onClick={()=>addExpense()}>Add</Button>
                  </Box>
              </>
              }

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
