import React from 'react'
import Box from '@mui/material/Box';
import GroupsIcon from '@mui/icons-material/Groups';
import { useEffect } from 'react';
import { Grid,Typography,TextField ,IconButton,InputAdornment  } from '@mui/material';
import { openModal } from '../../redux/modal/modalSlice';
import { useDispatch,useSelector } from 'react-redux';
import { fetchUserGroups } from '../../redux/userGroups/userGroupsSlice';
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import SearchIcon from "@mui/icons-material/Search";
const Groups = () => {
  const {UserGroupList} = useSelector((state)=>state.userGroups);
  const {user} =useSelector((state)=>state.auth);
  const {expense}=useSelector((state)=>state.expenses);

  const [searchTerm, setSearchTerm] = React.useState("");
  const dispatch = useDispatch();
  useEffect(()=>{
    dispatch(fetchUserGroups());
  },[dispatch])

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
    console.log("balances ----------->", balances);

    // Step 2: Filter only balances for current user
    const filteredBalance = balances[user.id];
    const filteredWithName = [];

    for (const toId in filteredBalance) {
      const toUser =  toId;
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
        const fromUser = fromId;
        const toUser = toId;
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

  }, [expense]);

  useEffect(()=>{
    console.log("UserGroupList from use selector-------->",UserGroupList)
  },[UserGroupList])

  const filteredGroups = UserGroupList.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
return (

    <Box sx={{ height: "100%" }}>
      <Grid
        sx={{
          height: "100vh",
          bgcolor: "#FCFAF9",
          fontFamily: "Montserrat, sans-serif",
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
        >
        {/* HEADER */}
<Box
  sx={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 1,
    px: 2,
    py: 3,
    borderBottom: "1px solid #DFE0DC",
    bgcolor: "#25291C",
    
  }}
>
  {/* 🔍 Search Box */}
  <TextField
    fullWidth
    size="small"
    placeholder="Search groups..."
    variant="outlined"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    sx={{
      bgcolor: "#fff",
      borderRadius: "2rem",
      "& .MuiOutlinedInput-root": {
        borderRadius: "2rem",
      },
      mx: 1,
    }}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <SearchIcon />
        </InputAdornment>
      ),
    }}
  />

  {/* Create Group Button */}
  <IconButton
    sx={{
      bgcolor: "#009F93",
      color: "#fff",
      "&:hover": {
        bgcolor: "#007f76",
      },
      borderRadius: "2rem",
      p: 1.2,
    }}
    onClick={() =>dispatch(openModal({
            modalType: 'CREATE_GROUP',
            modalProps: {
              title: 'Create group',
            }
          }))}
  >
    <GroupAddIcon sx={{ fontSize: 20 }}/>
  </IconButton>
</Box>

        {/* GROUP LIST */}
        <Box
          sx={{ p: 2, overflowY: "auto", mb: 6 }}
          component={motion.div}
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.08, // 🔥 stagger effect
              },
            },
          }}
        >
          {filteredGroups.map((item) => {
            return (
              <Box
                key={item.id}
                component={motion.div}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                whileHover={{ scale: 1.03 }} // 🔥 hover effect
                transition={{ duration: 0.25 }}
                sx={{
                  mb: 1.5,
                }}
              >
                <Box
                  component={Link}
                  to={`/expenses/${item.id}`}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 0.8,
                    borderRadius: "2rem",
                    textDecoration: "none",
                    border: "2px solid #25291C",
                    bgcolor: "#FFFFFF",
                    color: "#25291C",
                  }}
                >
                  {/* ICON */}
                  <Box
                    sx={{
                      height: 45,
                      width: 45,
                      borderRadius: "50%",
                      bgcolor: "#25291C",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "2px solid #25291C",
                      mr: 2,
                    }}
                  >
                    <GroupsIcon sx={{ color: "#DFE0DC", fontSize: 20 }} />
                  </Box>

                  {/* TEXT */}
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography sx={{ fontWeight: 600, fontSize: "0.9rem" }}>
                      {item.name}
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: "0.75rem",
                        fontWeight: 500,
                        color: "#636262",
                      }}
                    >
                      {item.members?.length || 0} members
                    </Typography>
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>
        </motion.div>
      </Grid>
      {/* <Fab
        onClick={() =>dispatch(openModal({
                    modalType: 'CREATE_GROUP',
                    modalProps: {
                      title: 'Create group',
                    }
                  }))}
        aria-label="Create Group"
        variant="extended"
        sx={{
          position: 'absolute',
          bottom: {xs:90,sm:20},
          right: 16,
          zIndex: 10,
          width:{xs:'11rem',md:'10rem'},
          bgcolor:'#25291C',
          border:'none', 
              '&:hover': {
          bgcolor: '#129490',
          color: '#fff',

        }, 
        }}
      >
        <Avatar sx={{ bgcolor: "transparent", color: "#129490", }}>
          <GroupAddIcon />
        </Avatar>
        <Typography sx={{color:"#129490", fontSize: "0.7rem",fontWeight: 600,fontFamily: 'Montserrat, sans-serif'}} >Create Group</Typography>
      </Fab> */}
    </Box>
);
}

export default Groups