require("dotenv").config()
const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
const cors = require('cors')
const app = express();
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');
const orderRoutes = require('./routes/order');

//db connection
mongoose.connect('mongodb://localhost:27017/ecom',{useUnifiedTopology: true,useNewUrlParser: true, useFindAndModify: false, useCreateIndex:true }, function(err){
    if(!err) return console.log("db connected successfully");
    return console.log(" error in db connection")
});

//middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//routes
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);
app.use('/api', orderRoutes);

//port
const port = process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log("server is running on port 3000!");
})
