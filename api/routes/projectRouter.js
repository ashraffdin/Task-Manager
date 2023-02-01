const express = require('express');
const router = express.Router();
const Project = require('../models/projectModel');
const Task = require('../models/taskModel');
const Attachment = require('../models/attachmentModel');
const fs = require('fs');

router.route('/')
.post(async(req,res)=>{ //A9
    try {
        const result = await Project.find({
          members:{ $elemMatch:{$eq:req.body.userId}}
        });

        if (!result) {
          res.json({
            status: "FAILED",
            message: "No project found",
          });
        } else {
          res.json({
            status: "SUCCESS",
            message: "Project founds",
            data: result,
          });
        }
      } catch (error) {
        console.log(error);
      }
});

router.route('/add')
.post(async(req,res)=>{ //A3
  const data = new Project(req.body.data);
  data.members.push(req.body.data.administrator)
  const result = await data.save();
  if (!result) {
    res.json({
      status: "FAILED",
      message: "Project not registered successfully",
    });
  } else {
    res.json({
      status: "SUCCESS",
      message: "Project registered successfully",
      data: result,
    });
  }
});


router.route('/:id')
.get((req,res)=>{
  Project.findById(req.params.id)
  .populate('members')
  .then(project=>{
    res.json({message:"success",users:project.members})
  }).catch(err=>res.status(500).json({error:"Something went wrong"}))
})
.put((req,res)=>{//A4
  console.log(req.params.id)
  Project.findById(req.params.id)
  .then(project=>{
    let newMembers = new Set();
    const currentMembers = project.members;
    currentMembers.push(req.body.member);
    for(let member of currentMembers){
        newMembers.add(member.toString()); 
    }
    project.members =  [...newMembers];
    project.save()
    res.json({message:"updated"})
  }).catch(err=>console.log(err))//res.status(500).json({error:"Something went wrong"}));

})
.delete((req,res)=>{ //B2
    const id = req.params.id;
    Project.findOneAndDelete({_id:id})
    .orFail()
    .then(data=>{
        Task.deleteMany({project:id})
        .then(_=>{
            Attachment.deleteMany({project:id})
            .then(deletedFile=>{
                res.json({message:`${data.name} have been deleted`})
            });
        });
    }).catch(err=>console.log(err));
});

module.exports = router;





// .get((req,res)=>{ //A8
//     const id = req.params.id;
//     Project.findById(id)
//     .orFail()
//     .then(data=>{data.populate(['administrator','members'])
//         .then(populated=>{
//             Task.find({project:data._id})
//             .then(tasks=>{
//                 console.log(populated)
//                 if(tasks) res.json({project:populated,tasks});
//                 else res.json({project:populated});
//             })
//         })
//     }).catch(err=>console.log(err))//res.status(404).json({error:"Something went wrong went loading project"}));
// })