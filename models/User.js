const mongoose=require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  name:  {type :String, required:true}, 
  email : {type : String,required:true},
  password:{type : String,required:true},
  createdDate:{type:Date,required:true,default:Date.now}
});

const user = mongoose.model('user',userSchema);

module.exports =user;