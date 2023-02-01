const express = require('express');
const router = express.Router();
const Task = require('../models/taskModel');

router.post('/',(req,res)=>{
    Task.find({project:req.body.projectId})
    .then(tasks=>{
        res.json({tasks})
    }).catch(err=>res.status(500).json({error:"Something went wrong"}));
});

//A5
router.post('/create',(req,res)=>{
    const {projectId,description,deadline} =  req.body;
    const task = new Task({
        description,
        status:'pending',
        deadline,
        project:projectId
    });

    task.save().then(savedTask=>{
        res.json({ message:"Task created",id:savedTask._id,});
    }).catch(err=>{
        console.log(err);
        res.status(403).json({error:"Failed to create task"});
    });
});

//A5 
router.route('/:id')
.get((req,res)=>{
    const taskId = req.params.id;
    Task.findById(taskId)
    .populate('assignedTo')
    .populate({
        path:'project',
        populate:{
            path:'members',
            model:'user'
        }
    }).then(task=>res.json({task}))
    .catch(err=>res.status(500).json({error:"Something went wrong"}));
})
.put((req,res)=>{
    const taskId = req.params.id;
    const {adminId,newUser} = req.body;
    Task.findById(taskId)
    .populate('project')
    .then(task=>{
        if(task.project.administrator == adminId && task.status != 'completed'){
            let newAssignment = new Set();
            task.assignedTo.push(newUser)
            for(let p of task.assignedTo){
                newAssignment.add(p.toString()); 
            }
            task.assignedTo =  [...newAssignment];
            task.status = 'ongoing';
            task.save()
            .then(savedTask => res.json({message:"Task successfully assigned"}))
            .catch(err=>res.status(500).json({error:"Something went wrong"}));
        }else{
            res.status(403).json({error:"You are not allowed to add new member to this task"});
        }
        
    }).catch(err=>console.log(err))//res.status(404).json({error:"Failed to find the task"}));
});

module.exports = router;