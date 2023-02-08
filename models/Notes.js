const mongooose = require('mongoose');

const {Schema} = mongooose;

const notesSchema =new Schema({
    title : {type:String ,required:true},
    description : {type:String,required:true},
    createdBy : {type : mongooose.Schema.Types.ObjectId, ref : 'user', required:true},
    date : {type:Date, default : Date.now},
    tag : {type:String,default : "General"}
});

const notes=mongooose.model('notes',notesSchema);

module.exports=notes;