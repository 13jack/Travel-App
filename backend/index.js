const express = require('express')
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = express();
const pinRoute = require('./routes/pins');
const  userRoute = require('./routes/users');
var cors = require("cors");
app.use(cors());    
dotenv.config();

app.use(express.json());

mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log("Mongodb connected");
}).catch((err)=> console.log(err));

app.use("/api/pins", pinRoute)
app.use("/api/users", userRoute)

app.listen(8800, ()=>{
    console.log("Mongoose is running!...")
})