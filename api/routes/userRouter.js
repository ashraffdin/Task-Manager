const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/userModel');

router.get('/',(req,res)=>{
    User.find({})
    .then(users=>{res.json({users})})
    .catch(err=>res.status(500).json({error:"Something went wrong"}));
});


//A1
router.post('/login',(req,res)=>{
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({email}).orFail()
    .then(user=>{
        bcrypt.compare(password,user.password)
        .then( valid =>{
            if(!valid){
                res.status(404).json({error:"Wrong credentials"});
            } 
            else{
                res.json({message:"Successfully login",id:user._id});
            } 
        })
    }).catch(err=>res.status(500).json({error:"Something went wrong"}));
});

//A1
router.post('/register',(req,res)=>{
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({name})
    .orFail()
    .then(_=>{res.status(403).json({error:"Name is already taken"})})
    .catch(_=>{
        new User({name,email,password}).save()
        .then(user=>{res.json({message:"Account registered"})})
        .catch(err=>{res.status(500).json({error:"Something went wrong"})});
    });
});

//A2
router.route('/:id')
.get((req,res)=>{
    const id = req.params.id;
    User.findById(id)
    .orFail()
    .then(user=>res.json({user}))
    .catch(err=>{res.status(404).json({error:"Invalid User"})});
})
.put((req,res)=>{
    const id = req.params.id;
    const password = req.body.password;
    User.findById(id)
    .orFail()
    .then(user=>{
        if(user){
            user.password = password;
            user.save()
            .then(_=>{res.json({message:"Account Updated"})})
            .catch(err=>{res.status(500).json({error:"Failed to update"})});
        }
    }).catch(err=>{res.status(400).json({error:"Invalid User"})});
});

module.exports = router;