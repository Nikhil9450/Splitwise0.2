import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Modal,
  Pagination,
  IconButton,
  Avatar,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { motion } from "framer-motion";
const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [open, setOpen] = useState(false);

  const usersPerPage = 9;

  const fetchAllUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/admin/fetchAllUsers", {
        credentials: "include",
      });
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      alert("Error fetching users");
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLast = page * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);

  const handleCardClick = (user) => {
    setSelectedUser(user);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
  };

  const handleSave = () => {
    setOpen(false);
  };

    return (
    <Box
      sx={{
        height: "100%",        
      }}
    >
        <Box sx={{ display: "flex", justifyContent: "space-between", mb:1,bgcolor: "#25291C",padding:2}}>
          <Typography variant="h6" sx={{fontFamily: "Montserrat, sans-serif",color:'#129490',fontWeight:600}}>
            Admin Dashboard
          </Typography>
        </Box>
        <Box 
            sx={{
            minHeight: "100vh",
            p: 3,
            bgcolor: "#DFE0DC",
            color: "white",
            fontFamily: "Montserrat, sans-serif",
            "*": { fontFamily: "Montserrat, sans-serif" },
            }}
        >
            {/* Search */}
            <TextField
                fullWidth
                size="small"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{
                mb: 2,
                bgcolor: "#fff'",
                borderRadius: "2rem",
                input: { color: "black" },
                }}
            />

            {/* Cards */}
            <Box
                sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: 2,
                }}
            >
                {currentUsers.map((user, index) => (
                <motion.div
                    key={user._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ delay: index * 0.04 }}
                >
                    <Card
                    onClick={() => handleCardClick(user)}
                    sx={{
                        bgcolor: "#ffff",
                        borderRadius: "2rem",
                        color: "#25291C",
                        p: 1,
                        cursor: "pointer",
                    }}
                    >
                    <CardContent
                        sx={{
                        p: "10px !important",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        }}
                    >
                        <Avatar sx={{ width: 32, height: 32, bgcolor: "#25291C" }}>
                        {user.name?.charAt(0)?.toUpperCase()}
                        </Avatar>

                        <Typography variant="subtitle2" noWrap sx={{ fontWeight: 600,fontFamily: "Montserrat, sans-serif"  }}>
                        {user.name}
                        </Typography>
                    </CardContent>
                    </Card>
                </motion.div>
                ))}
            </Box>

            {/* Pagination */}
            <Box mt={3} display="flex" justifyContent="center">
                <Pagination
                size="small"
                count={Math.ceil(filteredUsers.length / usersPerPage)}
                page={page}
                onChange={(e, value) => setPage(value)}
                sx={{ "& .MuiPaginationItem-root": { color: "white" } }}
                />
            </Box>
        </Box>

      {/* Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            p: 2,
          }}
        >
          <Box
            component={motion.div}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            sx={{
              bgcolor: "#DFE0DC",
              p: 3,
              borderRadius: "2rem",
              width: "90%",
              maxWidth: 400,
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Typography variant="h6" sx={{fontFamily: "Montserrat, sans-serif",fontWeight: 600}}>
                User Details
              </Typography>
              <IconButton onClick={handleClose} sx={{ color: "#25291C" }}>✕</IconButton>
            </Box>

            {/* Avatar + Name */}
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Avatar sx={{ bgcolor: "#25291C" }}>
                {selectedUser?.name?.charAt(0)?.toUpperCase()}
              </Avatar>
              <Typography variant="subtitle1" sx={{ fontFamily: "Montserrat, sans-serif",fontWeight: 600 }}>
                {selectedUser?.name}
              </Typography>
            </Box>

            <Typography variant="body2" sx={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}>
              Email: {selectedUser?.email}
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}>
              Role: {selectedUser?.role}
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}    mb={2}>
              Created at: {selectedUser?.createdAt && new Date(selectedUser.createdAt).toLocaleDateString()}
            </Typography>

            <Box display="flex" justifyContent="flex-end">
              <IconButton
                onClick={handleClose}
                sx={{ bgcolor: "#7f1d1d", borderRadius: "1rem", color: "white" }}
              >
                <Delete />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default AdminDashboard;
