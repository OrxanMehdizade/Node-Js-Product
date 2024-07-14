const User = require('../models/user');

async function isAdmin(req,res,next){
    try{
        const userId=req.user.id;
        
        const user = await User.findById(userId);

        if(!user) return res.sendStatus(404); 

        if(!user.isAdmin) return res.sendStatus(403); 

        next();
    }catch(err){
        res.sendStatus(500);
    }
}

module.exports=isAdmin;