const { User } = require("../model/User");
const crypto = require("crypto");
const { senitizeUser } = require("../services/common");
const jwt = require("jsonwebtoken");
exports.createUser = async (req, res) => {
  try {
    var salt = crypto.randomBytes(16);
    crypto.pbkdf2(
      req.body.password,
      salt,
      310000,
      32,
      "sha256",
      async function (err, hashedPassword) {
        const user = new User({ ...req.body, password: hashedPassword, salt });
        const result = await user.save();

        req.login(senitizeUser(result), (err) => {
          if (err) {
            return res.status(400).json(err);
          } else {
            const token = jwt.sign(senitizeUser(result),process.env.JWT_SECRET_KEY);
            res
              .cookie("jwt", token, {
                expires: new Date(Date.now() + 3600000),
                httpOnly: true
              })
              .status(201)
              .json({id:result.id,role:result.role});
          }
        });
      }
    );
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.loginUser = async (req, res) => {
  // res.json(req.user)
  res.cookie("jwt", req.user.token, {
    expires: new Date(Date.now() + 360000),
    httpOnly: true
  }).status(201).json({id:req.user.id,role:req.user.role});

  //  try{
  //     const user=await User.findOne({email:req.body.email}).exec()
  //     if(!user){
  //         res.json({message:"invalid credentials"})
  //     }
  //     else if(user.password===req.body.password){
  //         res.json(user)
  //     }
  //     else{
  //       res.json({massage:"invalid cradintial"})
  //     }
  //  }
  //  catch(err){
  //     res.json(err)

  //  }

  //  try{

  //     const user=await User.findOne({email:username}).exec()
  //     if(!user){
  //       done(null,false,{message:"invalid credentials"})
  //     }
  //     else if(user.password===password){
  //       done(null,user)
  //     }else{
  //       done(null,false,{massage:"invalid cradintial"})

  //     }
  //     }catch(err){
  //       done(err)
  //     }
};

exports.checkUser = async (req, res) => {
    if(req.user){
      res.json(req.user);
    }
    else{
      res.sendStatus(401);
    }
  // res.json({ status: "success", user: req.user });
};
