const express = require('express');
const router = express.Router();
const Attachment = require('../models/attachmentModel');
const multer = require('multer');
const upload = multer({dest:"uploads"});


router.route('/')
.get((req,res)=>{
    Attachment.find({})
    .then(attachments=>{res.json({attachments});
    }).catch(err=>res.status(500).json({error:"Something went wrong"}))
})
.post((req,res)=>{
    Attachment.find({project:req.body.project})
    .then(attachments=>{res.json({attachments});
    }).catch(err=>res.status(500).json({error:"Something went wrong"}))
})

//A6
router.post('/create',upload.any('file_uploaded'),(req,res)=>{
    const attachment = new Attachment({
        path:`${req.files[0].destination}/${req.files[0].filename}`,
        name:req.files[0].originalname,
        project:req.body.projectId
    });

    attachment.save()
    .then(savedAttachment=>{
        res.json({message:"Successfully created attachment",id:savedAttachment._id});
    }).catch(err=>res.status(500).json({err:"Something went wrong when creating attachment"}));
});

//A8
router.get('/:id',(req,res)=>{
    Attachment.findById(req.params.id)
    .then(attachment =>{
        res.download(attachment.path,attachment.name);
    }).catch(err=>res.status(404).json({err:"Something went wrong when fetching attachment"}));
});



module.exports = router