"use strict";
const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');

//express setup
const app = express();
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());
app.use(cors());
dotenv.config();

//connect to database
mongoose.set("strictQuery", false);
mongoose.connect(process.env.DB_URI)
 .then(res=>{console.log("connected to database")})
 .catch( err =>{console.log(err)});

//routes
const userRouter = require('./api/routes/userRouter');
app.use('/user',userRouter);

const projectRouter = require('./api/routes/projectRouter');
app.use('/project',projectRouter);

const taskRouter = require('./api/routes/taskRouter');
app.use('/task',taskRouter);

const attachmentRouter = require('./api/routes/attachmentRouter');
app.use('/attachment',attachmentRouter);


//homepage
app.get('/',(req,res)=>{
    res.send("hi");
});

app.listen(process.env.PORT||3000,()=>{
    console.log("server started")
})