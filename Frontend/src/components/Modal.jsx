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
  Collapse ,
  ListItemIcon,
  ListSubheader ,
  Dialog,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
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
import { addExpense,updateExpense,deleteExpense } from '../redux/expense/expenseSlice';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { logout } from '../redux/auth/authSlice';
import { setViewType } from '../redux/GroupViewType/viewTypeSlice';
import { useNavigate } from 'react-router-dom';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Slide from '@mui/material/Slide';
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const style = {
  p: 4,
  bgcolor:"#DFE0DC",
};

export default function TransitionsModal() {
    const { isOpen, modalType, modalProps } = useSelector((state) => state.modal);
    const {friends,sentRequests,recievedRequests} = useSelector((state)=>state.friendList)
    const {UserGroupList,GroupDetails} = useSelector((state)=>state.friendList)
    const {status,user} = useSelector((state)=>state.auth)
    const {viewType}=useSelector((state)=>state.viewType)
    const [selectedUser,setSelectedUser]=useState([]);
    const [groupName,setGroupName]=useState("")
    const [selectedGroupMember,setSelectedGroupMember]=useState([])
    const [paidBy, setPaidBy] = useState("");
    const [splitType, setSplitType] = useState("Equally");
    const [splitContainer,setSplitContainer]=useState(false)
    const [remainingAmt,setRemainingAmt]=useState(0)
    const [updatedUserDetails,setUpdatedUserDetails]= useState({
        name:modalProps.name,
        email:modalProps.email,
      })
    const [passwordDetails,setPasswordDetails]=useState({
      currentPassword: "",
      newPassword: ""
    });

    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [splitByAmount,setSplitByAmount]=useState({});
    const [splitBetweenUsers,setSplitBetweenUsers]=useState({});
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const navigate = useNavigate();
    const [openMap, setOpenMap] = useState({});
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

    const resetUnequallyAmt =()=>{
      if(modalProps?.title !== "Edit Expense"){
        if (modalProps?.groupMemberList?.length) {
        const initialSplit = modalProps.groupMemberList.reduce((acc, user) => {
          // acc[user._id] = "";
          acc[user._id] = {
            userId: user._id,
            owesTo: "",
            amount: ""
          };
          return acc;
        }, []);
          setSplitByAmount(initialSplit);
        }
      }
    }

    useEffect(() => {
      console.log("modalProps----->",modalProps);
      if (modalProps.title === "Edit Expense" && modalProps.expenseDetail?.splitBetweenWithAmt) {
        const initial = {};
        modalProps.expenseDetail.splitBetweenWithAmt.forEach((item) => {
          initial[item.user._id] = {
            userId: item.user._id,
            owesTo: modalProps.expenseDetail.paidBy._id,
            amount:Number(item.amount.toFixed(2))
          };
        });
        console.log("initial-------------->",initial)
        setSplitByAmount(initial);
        setAmount(modalProps.expenseDetail.amount);
        setSelectedDate(dayjs(modalProps.expenseDetail.date));
        setDescription(modalProps.expenseDetail.description);
        setPaidBy(modalProps["expenseDetail"].paidBy._id);
      }else{
        setDescription("");
        setAmount("");
        setSelectedDate(dayjs())
        // setPaidBy(user.id)
      }
    }, [modalProps]);


    useEffect(() => {
      resetUnequallyAmt();
    }, [modalProps.groupMemberList]);

    useEffect(()=>{
      console.log("splitByAmount----------->",splitByAmount)
      const ItemPrice = Number(amount);
      console.log("ItemPrice----------->",ItemPrice)

      const sumOfSplitAmount = Object.values(splitByAmount).reduce((acc, user) =>
            {
              const sum= acc + Number(user.amount);
              return sum;
            } , 0);
            setRemainingAmt(Math.floor(ItemPrice-sumOfSplitAmount));
    },[splitByAmount,amount])

    useEffect(()=>{
      setSelectedUser (user?.id ? [user.id] : [])
    },[user])
    useEffect(()=>{
      console.log('splitType------------------------>',splitType) ;
    })
    useEffect(() => {
      if (modalProps.title === 'Edit Expense' && modalProps['expenseDetail']['splitType']==="Equally"){
        const selectedMember = modalProps.expenseDetail.splitBetweenWithAmt
          ?.filter(user => user.amount !== 0)
          .map(user => user.user._id);

          console.log("selectedMember------------------------->",selectedMember)
          setSelectedGroupMember(selectedMember)
      }else if(modalProps.title === 'Edit Expense' && modalProps['expenseDetail']['splitType']==="Unequally"){
           
      }else{
        if (modalProps?.groupMemberList) {
          setSelectedGroupMember(modalProps.groupMemberList.map((member) => member._id));
        }
      }
      if(user && (modalProps.title !== "Edit Expense")){
        setPaidBy(user.id)
      }
    }, [modalProps?.groupMemberList,user]);
    
    useEffect(() => {
      if (modalType === "EDIT_PROFILE") {
            setUpdatedUserDetails({
              name: modalProps.name || "",
              email: modalProps.email || "",
            });
      }else if(modalType === "CHANGE_PASSWORD"){
            setPasswordDetails({
              currentPassword: "",
              newPassword: ""
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
      if(selectedUser.length===0 || groupName===""){
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
        toast.success("Updated successfully.");
      }catch(error){
        console.log("error--------->",error);
        toast.error(error.response?.data?.error || "Something went wrong");
      }
      
    }

    const changePassword = async () => {
      try {
        const response = await axios.post('http://localhost:5000/editUser/change-password', passwordDetails, {
          withCredentials: true
        });
        console.log("API response------>", response);
        dispatch(closeModal());
        dispatch(logout());
        toast.success("Password changed successfully. Please login again.");
      } catch (error) {
        console.log("error--------->", error);
        toast.error(error.response?.data?.error || "Something went wrong");
      }
    };


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
      if(splitType==='Equally'){
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
      }else if(splitType==='Unequally'){
        //  resetUnequallyAmt();
        return (
          <>
            <Typography variant="h6">Split by exact amount</Typography>
            <List dense sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
              {modalProps.groupMemberList.map((user) => {
                const userId=user._id;
                const labelId = `checkbox-list-secondary-label-${user._id}`;
                let filteredUser;
                if(modalProps.title==="Edit Expense"){
                  filteredUser = modalProps['expenseDetail']['splitBetweenWithAmt'].filter((user)=>user.user._id === userId);
                  console.log(filteredUser[0].user.name,"filteredUser amount--------------->",filteredUser[0].amount);  
                  console.log("splitByAmount[userId].amount-------->",splitByAmount[userId].amount) ;
                }

                return (
                  <ListItem
                    key={user._id}
                    secondaryAction={
                      <TextField 
                            id="standard-basic" 
                            label="₹" 
                            variant="standard" 
                            size="small" 
                            sx={{width:'2rem'}} 
                            onChange={
                              (e)=>{
                                  setSplitByAmount((prev) => ({
                                    ...prev,
                                    [user._id]: {
                                      userId: user._id,
                                      owesTo: paidBy,
                                      amount: e.target.value,
                                    }
                                  }));
                              }
                            } 
                            // value={ (modalProps.title==="Edit Expense")?filteredUser[0].amount : splitByAmount[userId].amount} 
                            value={splitByAmount[userId]?.amount || ""}  
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
              <ListItem
                    disablePadding
                  >
                      <ListItemText                 
                          secondary={`Remaining amount: ${remainingAmt}`}
                              sx={{
                                '& .MuiListItemText-secondary': {
                                  fontSize: '14px',
                                  color: '#1976d2',
                                },                      
                              }}                       
                      />
                  </ListItem>
            </List>
            <Box sx={{display:'flex',justifyContent:'end',marginTop:'2rem'}}>
              <Button variant='outlined' color="error"
                  onClick={()=>{
                    setSplitContainer(false);
                    setSplitType("Equally");
                    resetUnequallyAmt();
                    // setDescription("");
                    // setAmount("");
                  }}
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

    const add_Expense = async() => {
      let split = {};

      if (splitType === "Equally") {
        const perPersonPrice = Number(amount) / selectedGroupMember.length;

        split = modalProps.groupMemberList.reduce((acc, user) => {
          if (selectedGroupMember.includes(user._id)) {
            acc[user._id] = {
              userId: user._id,
              owesTo: paidBy,
              amount: perPersonPrice
            };
          } else {
            acc[user._id] = {
              userId: user._id,
              owesTo: paidBy,
              amount: 0
            };
          }
          return acc;
        }, {});
      } else if (splitType === "Unequally") {
        split = splitByAmount;
      }
      
      // optionally update the state
      setSplitBetweenUsers(split);

      const data = {
        description,
        amount,
        paidBy,
        addedBy:user.id,
        group:modalProps.groupId,
        splitType,
        splitBetweenWithAmt: split,
        date:selectedDate,
      };
      console.log("data before comparision------->",data);
      if(data.description===""||data.amount===0 || data.amount===""){
        toast.error("Please fill the details.")
      }else{
        console.log("modalProps.expenseDetail-------->", modalProps.expenseDetail);
          if(modalProps.title==="Edit Expense"){
            const previousDetails = modalProps.expenseDetail;
            console.log("previousDetails------------>",previousDetails)
            data['expenseId'] = modalProps.expenseDetail._id;
            console.log("currentDetails------------>",data)
            dispatch(updateExpense(data));
            dispatch(closeModal());
            dispatch(setViewType("expenses"));
          }else{
            dispatch(addExpense(data));
            dispatch(closeModal());
          }

      }

    };

    const delete_Expense =()=>{
      const data ={
            group:modalProps.groupId,
            expenseId:modalProps.expenseId
      }
      console.log("data before comparision------->",data);
      if(data.group===""||data.expenseId===0 ){
        toast.error("data insufficient");
      }else{
        console.log("expenseId-------->", modalProps.expenseId);
            dispatch(deleteExpense(data));
            dispatch(closeModal());
            navigate(`/expenses/${modalProps.groupId._id}`);     
      }
    }

    const save=(type)=>{
      if(type==="Equally"){
        if(selectedGroupMember.length===0){
          toast.error("Please select at least one member.")
        }else{
          setSplitType(type);
          setSplitContainer(false);
          resetUnequallyAmt();
        }
      }else if(type==="Unequally"){
        const ItemPrice = Number(amount);
        // setAmount()
        const sumOfSplitAmount = Object.values(splitByAmount).reduce((acc, user) =>
          {
            const sum= acc + Number(user.amount);
            return sum;
          } , 0);
        console.log("product_amt,sumOfAmount------>",ItemPrice,sumOfSplitAmount,typeof(ItemPrice),typeof(sumOfSplitAmount))
        if(remainingAmt===0){
          setSplitType(type);
          setSplitContainer(false);
        }else{
          toast.error("Total sum of the amount is not matched.");          
        }
      }
    }

    const renderModalContent = () => {
      console.log("modalType------------>",modalType)
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
          case "CHANGE_PASSWORD":
          return (
            <>
              <Typography variant="h6">{modalProps.title}</Typography>
              <TextField
                label="Enter Current Password"
                defaultValue=""
                fullWidth
                type='password'
                sx={{ mt: 2 }}
                onChange={(event)=>setPasswordDetails({...passwordDetails,'currentPassword':event.target.value})}
              />
              <TextField
                label="Enter New Password"
                defaultValue=""
                fullWidth
                type='password'
                sx={{ mt: 2 }}
                onChange={(event)=>setPasswordDetails({...passwordDetails,'newPassword':event.target.value})}
              />
              <DialogActions>
                <Button onClick={() => dispatch(closeModal())}>Cancel</Button>
                <Button onClick={() => changePassword()}>Submit</Button>
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
                    {/* Title */}
                    <Typography
                      sx={{
                        mb: 3,
                        fontWeight: 600,
                        color: '#25291C',
                        fontFamily: "Montserrat, sans-serif",
                        fontSize:'1.5rem'
                      }}
                    >
                      {modalProps.title}
                    </Typography>

                    {/* Input Section */}
                    <Box>
                      {/* Description */}
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            p: 1.4,
                            border: '2px solid #25291C',
                            borderRadius:'2rem',
                            bgcolor: '#DFE0DC',
                            mr: 1,
                          }}
                        >
                          <DescriptionIcon sx={{ color: '#25291C' , height: '1rem' }} />
                        </Box>

                      <TextField
                        label="Description"
                        variant="outlined"
                        fullWidth
                        size="small"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        InputLabelProps={{
                          sx: {
                            fontFamily: "Montserrat, sans-serif",
                            fontSize: '1rem',
                            fontWeight: 500,
                            color: '#25291C',
                            '&.Mui-focused': {
                              color: '#129490',
                            },
                          },
                        }}
                        InputProps={{
                          sx: {
                            fontFamily: "Montserrat, sans-serif",
                            fontSize: '1rem',
                            fontWeight: 500,
                            borderRadius: '2rem',
                            borderWidth: '2px',

                            // Default border
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#25291C',
                              borderWidth: '2px',
                            },

                            // Hover
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#25291C',
                              borderWidth: '2px',
                            },

                            // Focus
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#129490',
                              borderWidth: '2px',
                            },
                          },
                        }}
                      />
                      </Box>

                      {/* Amount */}
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            p: 1.4,
                            border: '2px solid #25291C',
                            borderRadius:'2rem',
                            bgcolor: '#DFE0DC',
                            mr: 1,
                          }}
                        >
                          <CurrencyRupeeIcon sx={{ color: '#25291C', height: '1rem' }} />
                        </Box>

                        <TextField
                          type="number"
                          label="Amount"
                          variant="outlined"
                          fullWidth
                          size="small"
                          value={amount}
                          onChange={(e) => setAmount(Number(e.target.value))}
                          InputLabelProps={{
                            sx: {
                              fontFamily: "Montserrat, sans-serif",
                              fontSize: '1rem',
                              fontWeight: 500,
                              color: '#25291C',
                              '&.Mui-focused': {
                                color: '#129490',
                              },
                            },
                          }}
                          InputProps={{
                            sx: {
                              fontFamily: "Montserrat, sans-serif",
                              fontSize: '1rem',
                              fontWeight: 500,
                              borderRadius: '2rem',
                              borderWidth: '2px',

                              // Default border
                              '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#25291C',
                                borderWidth: '2px',
                              },

                              // Hover
                              '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#25291C',
                                borderWidth: '2px',
                              },

                              // Focus
                              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#129490',
                                borderWidth: '2px',
                              },
                            },
                          }}
                        />
                      </Box>
                    </Box>

                    {/* Paid By + Split */}
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mt: 4,
                        gap: 2,
                      }}
                    >
                      {/* Paid By */}
                      <FormControl variant="outlined" fullWidth>
                        <InputLabel
                          sx={{
                            fontFamily: "Montserrat, sans-serif",
                            fontSize: '1rem',
                            fontWeight: 500,
                            color: '#25291C',
                          }}
                        >
                          Paid By
                        </InputLabel>

                        <Select
                          value={paidBy}
                          label="Paid By"
                          onChange={(e) => setPaidBy(e.target.value)}
                          sx={{
                            fontFamily: "Montserrat, sans-serif",
                            fontSize: '1rem',
                            borderRadius: '2rem',
                            border: '2px',
                            height: '2.5rem',

                            // Default (inactive)
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#25291C',
                              borderWidth: '2px',
                            },

                            // Hover
                            // '&:hover .MuiOutlinedInput-notchedOutline': {
                            //   borderColor: '#129490',
                            // },

                            // Focus (active)
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#129490',
                              borderWidth: '2px',
                            },
                          }}
                        >
                          {modalProps.groupMemberList.map((user) => (
                            <MenuItem
                              key={user._id}
                              value={user._id}
                              sx={{
                                fontFamily: "Montserrat, sans-serif",
                                fontSize: '.875rem',
                              }}
                            >
                              {user.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>


                    </Box>
                    {/*Date + Split Buttons */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <MobileDatePicker
                          value={selectedDate}
                          onChange={(newValue) => setSelectedDate(newValue)}
                          format="YYYY-MM-DD"
                          enableAccessibleFieldDOMStructure={false} // 👈 FIX
                          maxDate={dayjs()}
                          minDate={dayjs('2020-01-01')}
                          slots={{
                            textField: (params) => (
                              <TextField
                                {...params}
                                variant="outlined"
                                size="small"
                                sx={{
                                  width: 180,

                                  // Label
                                  '& .MuiInputLabel-root': {
                                    fontFamily: "Montserrat, sans-serif",
                                    fontSize: '1rem',
                                    fontWeight: 500,
                                    color: '#25291C',
                                  },
                                  '& .MuiInputLabel-root.Mui-focused': {
                                    color: '#129490',
                                  },

                                  // Input root
                                  '& .MuiOutlinedInput-root': {
                                    fontFamily: "Montserrat, sans-serif",
                                    fontSize: '1rem',
                                    fontWeight: 500,
                                    borderRadius: '2rem',

                                    '& fieldset': {
                                      borderColor: '#25291C',
                                      borderWidth: '2px',
                                    },

                                    '&:hover fieldset': {
                                      borderColor: '#25291C',
                                    },

                                    '&.Mui-focused fieldset': {
                                      borderColor: '#129490',
                                      borderWidth: '2px',
                                    },
                                  },
                                }}
                              />
                            ),
                          }}
                        />
                      </LocalizationProvider>
                      <ButtonGroup
                        size="small"
                        sx={{
                          borderRadius: '2rem',
                          overflow: 'hidden', // 👈 important
                          border: '2px solid #25291C', 
                        }}
                      >
                        <Button
                          onClick={() => splitTypeHandler("Equally")}
                          sx={{
                            fontFamily: "Montserrat, sans-serif",
                            textTransform: 'none',
                            bgcolor: splitType === "Equally" ? '#25291C' : 'transparent',
                            color: splitType === "Equally" ? '#fff' : '#25291C',
                            borderColor: '#DFE0DC',

                            borderTopLeftRadius: '2rem',
                            borderBottomLeftRadius: '2rem',

                            '&:hover': {
                              bgcolor: splitType === "Equally" ? '#4f504c' : '#f5f5f5',
                            },
                          }}
                        >
                          Equally
                        </Button>

                        <Button
                          onClick={() => splitTypeHandler("Unequally")}
                          sx={{
                            fontFamily: "Montserrat, sans-serif",
                            textTransform: 'none',
                            bgcolor: splitType === "Unequally" ? '#25291C' : 'transparent',
                            color: splitType === "Unequally" ? '#fff' : '#25291C',
                            borderColor: '#DFE0DC',

                            borderTopRightRadius: '2rem',
                            borderBottomRightRadius: '2rem',

                            '&:hover': {
                              bgcolor: splitType === "Unequally" ? '#4f504c' : '#f5f5f5',
                            },
                          }}
                        >
                          Unequally
                        </Button>
                      </ButtonGroup>
                    </Box>
                    {/* Date + Action */}
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'end',
                        mt: 8,
                        alignItems: 'center',
                      }}
                    >

                      <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={add_Expense}
                        sx={{
                          bgcolor: '#129490',
                          fontFamily: "Montserrat, sans-serif",
                          textTransform: 'none',
                          fontWeight: 500,
                          borderRadius: '2rem',
                          padding:'.6rem 1rem',
                          '&:hover': { bgcolor: '#0f7f7c' },
                        }}
                      >
                        {modalProps.title === "Edit Expense" ? "Update" : "Add"}
                      </Button>
                    </Box>
              </>
              }

              </>
            );
          case "DELETE_EXPENSE":
            console.log("inside delete expense",modalProps)
          return (
            <>
                <Typography variant="h6" sx={{marginBottom:'1rem'}} >{modalProps.title} ?</Typography>
                <Typography variant="body2"  >Are you sure you want to delete this expense? This will remove this expense for all people involved not just you.</Typography>
                <Box sx={{display:'flex',justifyContent:'end'}}>
                  <Button variant="text" onClick={()=>dispatch(closeModal())}>Cancel</Button>
                  <Button variant="text" onClick={()=>delete_Expense()}>OK</Button>
                </Box>
            </>
          );
          case "VIEW_MEMBERS":
            return (
              <>
                {/* HEADER */}
                <Typography
                  sx={{
                    mb: 2,
                    fontWeight: 600,
                    fontSize: "1rem",
                    color: "#25291C",
                    fontFamily: "Montserrat, sans-serif",
                  }}
                >
                  {modalProps.title}
                </Typography>

                {/* LIST */}
                <Box
                  sx={{
                    border: "1px solid #DFE0DC",
                    borderRadius: 2,
                    overflow: "hidden",
                    // bgcolor: "#FFFFFF",
                  }}
                >
                  <List sx={{ p: 0 }}>
                    {modalProps.groupMemberList?.map((item, index) => (
                      <ListItem
                        key={item._id}
                        sx={{
                          px: 2,
                          py: 1.2,
                          border:'2px solid #25291C',
                          borderRadius: '2rem',
                          bgcolor: "#FFFFFF",
                          mb: 1,
                        }}
                      >
                        {/* AVATAR */}
                        <ListItemAvatar sx={{ minWidth: 45 }}>
                          <Avatar
                            sx={{
                              width: 36,
                              height: 36,
                              bgcolor: "#DFE0DC",
                              color: "#25291C",
                              fontWeight: 600,
                              fontFamily: "Montserrat, sans-serif",
                            }}
                          >
                            {item.name?.charAt(0).toUpperCase()}
                          </Avatar>
                        </ListItemAvatar>

                        {/* TEXT */}
                        <ListItemText
                          primary={item.name}
                          secondary={item.email}
                          primaryTypographyProps={{
                            fontSize: "0.9rem",
                            fontWeight: 600,
                            color: "#25291C",
                            fontFamily: "Montserrat, sans-serif",
                          }}
                          secondaryTypographyProps={{
                            fontSize: "0.75rem",
                            color: "#9e9e9e",
                            fontFamily: "Montserrat, sans-serif",
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </>
            ); 
          case "VIEW_BALANCES": {
            const splitwiseData = buildSplitwiseView(modalProps.balances);
            const expenses = calculateBalances(modalProps.expense || []);
            console.log("splitwiseData----------->",splitwiseData);
            console.log("splitwiseData expenses----------->",expenses);
            console.log("splitwiseData modalProps.expenses----------->",modalProps.expense);
            return (
            <List sx={{ fontFamily: "Montserrat, sans-serif" }}>
              {Object.entries(expenses).map(([person, data]) => {
                const isOpen = openMap[person];
                const isOwing = data.netBalance < 0;
                const amount = Math.abs(data.netBalance);

                return (
                  <Box
                    key={person}
                    sx={{
                      mb: 2,
                      border: "1px solid #DFE0DC",
                      borderRadius:"  2rem",
                      overflow: "hidden",
                      bgcolor: "#FFFFFF",
                    }}
                  >
                    {/* HEADER */}
                    <ListItemButton
                      onClick={() => togglePerson(person)}
                      sx={{
                        px: 2,
                        py: 1.5,
                        display: "flex",
                        borderRadius:"2rem",
                        justifyContent: "space-between",
                      }}
                    >
                      <ListItemText
                        primary={person}
                        secondary={
                          amount === 0
                            ? "Settled"
                            : isOwing
                            ? `Owes ₹${amount.toLocaleString()}`
                            : `Gets back ₹${amount.toLocaleString()}`
                        }
                        primaryTypographyProps={{
                          fontWeight: 600,
                          fontSize: "0.95rem",
                          fontFamily: "Montserrat, sans-serif",
                          color: "#25291C",
                        }}
                        secondaryTypographyProps={{
                          fontSize: "0.8rem",
                          fontFamily: "Montserrat, sans-serif",
                          fontWeight: 500,
                          color:
                            amount === 0
                              ? "#9e9e9e"
                              : isOwing
                              ? "#ED474A"
                              : "#129490",
                        }}
                      />

                      {amount !== 0 && (
                        isOpen ? (
                          <ExpandLess sx={{ color: "#25291C" }} />
                        ) : (
                          <ExpandMore sx={{ color: "#25291C" }} />
                        )
                      )}
                    </ListItemButton>

                    {/* DROPDOWN */}
                    <Collapse in={isOpen && amount !== 0} timeout="auto" unmountOnExit>
                      <Box
                        sx={{
                          borderTop: "1px solid #DFE0DC",
                          px: 2,
                          py: 1,
                          bgcolor: "#FCFAF9",
                        }}
                      >
                        {Object.entries(data.relations).map(([other, value], idx) => (
                          <Box
                            key={other}
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              py: 1,
                              borderBottom:
                                idx !== Object.entries(data.relations).length - 1
                                  ? "1px solid #DFE0DC"
                                  : "none",
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: "0.85rem",
                                fontFamily: "Montserrat, sans-serif",
                                color: "#25291C",
                              }}
                            >
                              {other}
                            </Typography>

                            <Typography
                              sx={{
                                fontSize: "0.85rem",
                                fontFamily: "Montserrat, sans-serif",
                                fontWeight: 600,
                                color: value < 0 ? "#ED474A" : "#129490",
                              }}
                            >
                              {value < 0
                                ? `₹${Math.abs(value)} you owe`
                                : `₹${value} you get`}
                            </Typography>
                          </Box>
                        ))}

                        {/* ACTION BUTTONS */}
                        {/* {isOwing && (
                          <Box
                            sx={{
                              display: "flex",
                              gap: 2,
                              mt: 2,
                            }}
                          >
                            <Button
                              fullWidth
                              variant="outlined"
                              sx={{
                                borderColor: "#ED474A",
                                color: "#ED474A",
                                textTransform: "none",
                                fontWeight: 600,
                                fontFamily: "Montserrat, sans-serif",
                                "&:hover": {
                                  borderColor: "#c93a3d",
                                  backgroundColor: "rgba(237,71,74,0.05)",
                                },
                              }}
                            >
                              Remind
                            </Button>

                            <Button
                              fullWidth
                              variant="contained"
                              sx={{
                                bgcolor: "#129490",
                                textTransform: "none",
                                fontWeight: 600,
                                fontFamily: "Montserrat, sans-serif",
                                "&:hover": {
                                  bgcolor: "#0f7f7c",
                                },
                              }}
                            >
                              Settle Up
                            </Button>
                          </Box>
                        )} */}
                      </Box>
                    </Collapse>
                  </Box>
                );
              })}
            </List>
            );
          }

          default:
          return null;
      }
    };

  const togglePerson = (person) => {
    setOpenMap((prev) => ({
      ...prev,
      [person]: !prev[person],
    }));
  };
const buildSplitwiseView = (balances = {}) => {
  const pairNet = {};

  // Step 1: net pairwise balances
  Object.entries(balances).forEach(([from, obj]) => {
    Object.entries(obj).forEach(([to, amount]) => {
      pairNet[from] ??= {};
      pairNet[to] ??= {};

      pairNet[from][to] = (pairNet[from][to] || 0) + amount;
      pairNet[to][from] = (pairNet[to][from] || 0) - amount;
    });
  });

  const result = {};

  // Step 2: build Splitwise view (BOTH SIDES)
  Object.entries(pairNet).forEach(([person, relations]) => {
    result[person] = { total: 0, details: [] };
  });

  Object.entries(pairNet).forEach(([person, relations]) => {
    Object.entries(relations).forEach(([other, amount]) => {
      if (amount > 0) {
        // person owes other
        result[person].details.push({ other, amount });
        result[person].total -= amount;

        // other gets from person
        result[other].details.push({ other: person, amount });
        result[other].total += amount;
      }
    });
  });

  return result;
};
function calculateBalances(expenses) {
  const people = {};

  const ensureUser = (user) => {
    if (!people[user.name]) {
      people[user.name] = {
        userId: user._id,
        netBalance: 0,      // single source of truth
        relations: {}       // person-to-person net
      };
    }
  };

  // STEP 1: Build net balances & relations
  expenses.forEach(expense => {
    expense.splitBetweenWithAmt.forEach(({ user, owesTo, amount }) => {
      if (user._id === owesTo._id) return;

      ensureUser(user);
      ensureUser(owesTo);

      // user owes → negative
      people[user.name].netBalance -= amount;
      // owesTo gets → positive
      people[owesTo.name].netBalance += amount;

      // relation tracking
      people[user.name].relations[owesTo.name] =
        (people[user.name].relations[owesTo.name] || 0) - amount;

      people[owesTo.name].relations[user.name] =
        (people[owesTo.name].relations[user.name] || 0) + amount;
    });
  });

  // STEP 2: Normalize relations (remove zeros)
  Object.values(people).forEach(person => {
    Object.keys(person.relations).forEach(other => {
      if (person.relations[other] === 0) {
        delete person.relations[other];
      }
    });
  });

  // STEP 3: Derive totals (🔥 no double counting)
  Object.values(people).forEach(person => {
    if (person.netBalance > 0) {
      person.totalGetsBack = person.netBalance;
      person.totalOwed = 0;
    } else if (person.netBalance < 0) {
      person.totalOwed = Math.abs(person.netBalance);
      person.totalGetsBack = 0;
    } else {
      person.totalOwed = 0;
      person.totalGetsBack = 0;
    }
  });

  return people;
}




  return (
    // <div>
    //   <Modal
    //     // sx={{borderRadius:'10px',border:'none'}}
    //     aria-labelledby="transition-modal-title"
    //     aria-describedby="transition-modal-description"
    //     open={isOpen}
    //     onClose={(event, reason) => {
    //       if (reason === 'backdropClick') {
    //         // ✅ Trigger your custom function here
    //         setSplitType("Equally");
    //         setSplitContainer(false);

    //       }
    //       // This will still close the modal
    //       dispatch(closeModal());
    //     }}
    //     closeAfterTransition
    //     slots={{ backdrop: Backdrop }}
    //     slotProps={{
    //       backdrop: {
    //         timeout: 500,
    //       },
    //     }}
    //   >
    //     <Fade in={isOpen}>
    //         <Box sx={style}>
    //             {renderModalContent()}
    //         </Box>
    //     </Fade>
    //   </Modal>
    // </div>
    //  <React.Fragment   >

      <Dialog
        fullScreen
        open={isOpen}
        onClose={() => {
          dispatch(closeModal())
          }}
        slots={{
          transition: Transition,
        }}
         PaperProps={{
          sx: {
            bgcolor: "#DFE0DC",
          },
        }}
      >
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2, bgcolor:"#DFE0DC" }}>
      
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => dispatch(closeModal())}
              aria-label="close"
            >
              <CloseIcon sx={{color:"#25291C"}} />
            </IconButton>
      </Box>

        <Box sx={style}>
          {renderModalContent()}
        </Box>
      </Dialog>
    // </React.Fragment>
  );
}
