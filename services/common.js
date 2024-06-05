const passport=require('passport')
exports.isAuth=(req,res,done)=>{
    // if(req.user){
    //   done()
    // }
    // else{
    //   console.log("hasdkjfalksjdl")
    //   res.send(401)
    // }
    return passport.authenticate('jwt')
  }


  exports.senitizeUser=(user)=>{
return {id:user.id,role:user.role}
  }

  exports.cookieExtractor = function(req) {
    var token = null;
    if (req && req.cookies) {
        token = req.cookies['jwt'];
        // console.log(token)
    }
    // token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NTc1N2QyZDc1MGI5ZjNlNmExYjczNyIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzE3MDAwNTAxfQ.EMtQQ1pf3XUzpelQM3LbQkPWwqqD4VFuxwaWGTVJYrw"
    // token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NTc2NmZiMjNkYjVjN2UwYTFlMmI3YyIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcxNzAwNDIwMH0.-d0Gm9I0c-FUTm4yEByv4DBSNKruNJlqdNvw1qA0TYc"
    return token;
};