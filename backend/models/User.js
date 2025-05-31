const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const UserSchema=new Schema({
    name:{
        type:String,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
         type: String, 
         enum: ['student', 'examiner','admin'], 
         required: true 
    },

});
const UserModel=mongoose.model('User',UserSchema);
module.exports=UserModel;