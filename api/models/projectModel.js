"use strict";

const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name:{type:String},
    description:{type:String},
    administrator:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    members:[{
         type:mongoose.Schema.Types.ObjectId,
         ref:'user'
    }]
},{
    timestamps:true
});

const Project = mongoose.model('project',projectSchema);
module.exports = Project;