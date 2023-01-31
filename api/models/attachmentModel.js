"use strict";
const mongoose = require('mongoose');

const attachmentsSchema  = new mongoose.Schema({
    path:{
        type:String,
        require:true,
    },
    name:{
        type:String,
        require:true
    },
    project:{
        type:mongoose.Schema.Types.ObjectId,
        require:true,
        ref:'project'
    }
});

const Attachement = mongoose.model('attachments',attachmentsSchema);
module.exports = Attachement;
