const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        trim: true
    },
    description:{
        type: String,
        require: true,
        trim: true
    },
    price: {
        type: Number,
        require: true,
        trim: true
    },
    category: {
        type: ObjectId,
        ref: "Category",
        require: true
    },
    stock:{
        type: Number
    },
    sold:{
        type: Number,
        default: 0
    },
    photo:{
        type: Buffer,
        contentType: String
    }

}, {timestamps: true});

module.exports = mongoose.model("Product", productSchema)