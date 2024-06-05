const {User} =require("../model/User")
exports.fetchUserById=async (req,res)=>{
  console.log("i am user")
  const {id}=req.user;
console.log(id)
  try{
        console.log("hlw"+id)
    const user=await User.findById(id,);
    // console.log("hello")
     res.status(200).json({id:user.id,addresses:user.addresses,email:user.email,role:user.role})
       }catch(err){
        res.status(400).json(err)
       }
}

exports.updateUser=async(req,res)=>{
    const {id}=req.params;
    // console.log(typeof id)
 
  try{
    // const user=await User.findById(id,);
    const user=await User.findByIdAndUpdate(id,req.body,{new:true})
    // const user=await User.findByIdAndUPdate(id,req.body,{new:true})
    // console.log("hello")
    // console.log(user)
    res.status(200).json(user)
  }catch(err){
    res.status(400).json(err)
  }
}
