const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String, 
        min:4,
        max:16,
        require: true,
        unique: true
    },
    email:{
        type: String,
        require: true,
        max:45
    },
    password:{
        type: String,
        require: true,
        min:6
    }
},{timestamps:true}
);

module.exports = mongoose.model("User", userSchema);