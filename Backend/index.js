require ('dotenv').config();
const express = require("express")
const cors= require('cors');
const connectDB = require('./config/db');

const app = express();

connectDB();

app.use(cors({
  origin: 'http://localhost:3000', // frontend origin
  credentials: true
}));
app.use(express.json());


