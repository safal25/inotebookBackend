const express=require('express');
const router=express.Router();
const fetchuser=require('../middleware/fetchuser.js');
const Notes=require('../models/Notes.js');
const { body, validationResult } = require('express-validator');

//Api to return all user notes
router.get('/fetchnotes',fetchuser, async (req,res)=>{
    try {
        const userId=req.user.id;
        const notes=await Notes.find({createdBy : userId}).sort({date : -1});
        res.json(notes);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server error");
    }
});

//Api to save user notes
router.post('/addnotes',
        body('title','Title should have atleast 3 charachters').isLength({min :3}),
        body('description','Description should have atleast 10 charachters').isLength({min : 10}),fetchuser,async (req,res)=>{
    try {
        const {title,description,tag}=req.body;

        const errors=validationResult(req);
        if(!errors.isEmpty()){
            res.status(400).json({success:false,errors : errors.array()});
        }

        const newNote=new Notes({
            createdBy : req.user.id,
            title : title,
            description : description,
            tag : tag
        });
        
        const result=await newNote.save();
        return res.json({message : "Note Saved Successfully",note : result,success:true});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({error:"Internal Server Error",success:false});
    }
});

//Api to update existing user notes
router.put('/updatenote/:id',fetchuser,async (req,res)=>{
    try {

        const {title,description,tag}=req.body;
        const noteId=req.params.id;

        const updatedNote={};
        if(title){updatedNote.title=title};
        if(description){updatedNote.description=description};
        if(tag){updatedNote.tag=tag};

        let note=await Notes.findById(noteId);

        if(!note){return res.status(404).send("note note found")};
        if(note.createdBy.toString()!==req.user.id){
            return res.status(401).send("Update not allowed");
        }
        
        note=await Notes.findByIdAndUpdate(noteId,{$set : updatedNote},{new : true});
        res.json(note);

        
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error");
    }
});

//Api to delete existing notes
router.delete('/deletenote/:id',fetchuser,async (req,res)=>{
    try {

        const noteId=req.params.id;


        let note=await Notes.findById(noteId);

        if(!note){return res.status(404).send("note not found")};
        if(note.createdBy.toString()!==req.user.id){
            return res.status(401).send("Update not allowed");
        }
        
        note=await Notes.findByIdAndDelete(noteId);
        res.json({message : "note deleted successfully"});

        
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error");
    }
});

module.exports=router;