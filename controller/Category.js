const {Category} =require("../model/Category")
exports.fetchCategory=async (req,res)=>{
    try{
    const categorys=await Category.find({}).exec();
     res.status(200).json(categorys)
       }catch(err){
        res.status(400).json(err)
       }
}

exports.createCategory=async(req,res)=>{
    const category =new Category(req.body);

    try{
        const response=await category.save();
      res.status(201).json(response)
    }catch(err){
      res.status(400).json(err)
    }
  }
  

