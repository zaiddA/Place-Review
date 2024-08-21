const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();
const pinRoute = require("./routes/pins");

// const addProxyMiddleware = require('../frontend/src/setProxy');
// addProxyMiddleware(app);

var cors = require('cors')
app.use(cors())

dotenv.config();
app.use(express.json())

//mongoose.connect('mongodb+srv://ashutosh_ch:ashutosh_ch@cluster1.dqbunon.mongodb.net/?retryWrites=true&w=majority');

mongoose.connect(process.env.MONGO_URL)
.then((res)=>{
    console.log("mongoDB is connected")
})
.catch((err)=>{
    console.log("error")
})

//mongoose.connect(process.env.MONGO_URL);
//mongoose.connection.on('connected', () => console.log('Connected'));
//mongoose.connection.on('error', () => console.log('Connection failed with'));

app.use("/api/pins",pinRoute)

app.listen(8900,()=>{
    console.log("Backend server is running")
})
