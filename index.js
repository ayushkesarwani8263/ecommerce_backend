require('dotenv').config()
const express = require("express");
const server = express();
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require('passport');
const LocalStrategy=require('passport-local').Strategy;
const crypto=require("crypto")
const JwtStrategy = require('passport-jwt').Strategy;
// const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');
const cookieParser=require("cookie-parser")
const { isAuth, senitizeUser, cookieExtractor } = require("./services/common");
const {Order}=require("./model/Order")
// const path=require("path")

// const cookieExtractor=
// const SECRET_KEY='SECRET_KEY';
var opts = {}
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey =process.env.JWT_SECRET_KEY;

const {User}=require("./model/User")
const { createProduct } = require("./controller/Product");
const brandRouter = require("./routes/brand");
const categoriesRouter = require("./routes/Category");
const ProductRouter = require("./routes/Products");
const UserRouter = require("./routes/User");
const authRouter = require("./routes/Auth");
const cartRouter = require("./routes/Cart");
const orderRouter = require("./routes/Order");
const cors = require("cors");
const path = require('path');

//webhook
// server.js
//
// Use this sample code to handle webhook events in your integration.
//
// 1) Paste this code into a new file (server.js)
//
// 2) Install dependencies
//   npm install stripe
//   npm install express
//
// 3) Run the server on http://localhost:4242
//   node server.js

// The library needs to be configured with your account's secret key.
// Ensure the key is kept out of any version control system you might be using.
// const stripe = require('stripe')('sk_test_...');
// const express = require('express');
// const app = express();


// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = process.env.ENDPOINT_SECRET;

server.post('/webhook', express.raw({type: 'application/json'}),async(request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntentSucceeded = event.data.object;
      const order=await Order.findById(paymentIntentSucceeded.metadata.orderId);
      order.paymentStatus='received';
      await order.save();
      // Then define and call a function to handle the event payment_intent.succeeded
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});


server.use(express.static(path.resolve(__dirname,'build')))
server.use(cookieParser())

server.use(session({
  secret:process.env.SESSION_KEY,
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
 
}));
server.use(passport.authenticate('session'));

server.use(cors({
  exposedHeaders: ["X-Total-Count"]
}));
// server.use(express.raw({type:'application/json'}))
server.use(express.json());
server.use("/products",isAuth(),ProductRouter.router);
server.use("/brands",isAuth(), brandRouter.rotuer);
server.use("/categorys",isAuth(), categoriesRouter.rotuer);
server.use("/user",isAuth(),UserRouter.rotuer);
server.use("/auth", authRouter.router); 
server.use("/cart",isAuth(), cartRouter.router);
server.use("/orders",isAuth(), orderRouter.router);

server.get('*', (req, res) =>
  res.sendFile(path.resolve('build', 'index.html'))
);  


passport.use('local',new LocalStrategy({ usernameField: 'email' },
  async function(email, password, done) {
    try{
      const user=await User.findOne({email:email}).exec()
      if(!user){
       return done(null,false,{message:"invalid credentials"})
      }
      
      crypto.pbkdf2(password,user.salt, 310000, 32, 'sha256', async function(err, hashedPassword) {
        
        if(!crypto.timingSafeEqual(user.password, hashedPassword)){
         return done(null,false,{massage:"invalid cradintial"})
              
        }
          const token = jwt.sign(senitizeUser(user),process.env.JWT_SECRET_KEY);

        done(null,{id:user.id,role:user.role,token})

      })      
}catch(err){
  
  done(err)
}
  }
));


passport.use('jwt',new JwtStrategy(opts, async function(jwt_payload, done) {
  // console.log({jwt_payload})
    console.log("hlw");

  try{
    const user=await User.findById(jwt_payload.id)
    // console.log("hlw");

      if (user) {
        // console.log("hlw");
          return done(null, senitizeUser(user));
      } else {
        // console.log("alskjd")
          return done(null, false);
          // or you could create a new account
      }
  
  }catch(err){
    return done(err, false);
      
  }
  
}));

passport.serializeUser(function(user, cb) {
  process.nextTick(function(){
    // console.log("ssss")  
    // console.log(user)
    return cb(null, {
      id: user.id,
      role: user.role
    });
  });
});

passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});

   

//payment

// This is your test secret API key.
const stripe = require("stripe")(process.env.STRIPE_SERVER_KEY);

server.use(express.static("public"));
// server.use(express.json());

const calculateOrderAmount = (items) => {
  return 1400
};

server.post("/create-payment-intent", async (req, res) => {
  const { totalAmount,orderId} = req.body;
  
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount:totalAmount*100,
    currency: "inr",
    description: 'Testing',
    shipping: {
      name: 'Jenny Rosen',
      address: {
        line1: '510 Townsend St',
        postal_code: '98140',
        city: 'San Francisco',
        state: 'CA',
        country: 'US',
      },
    },
    
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
    metadata:{
      orderId
    }
  });



  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});





// app.listen(4242, () => console.log('Running on port 4242'));

// app.listen(4242, () => console.log("Node server listening on port 4242!"));


main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(process.env.MONGODB_URL);
  console.log("db connected");
}






// server.post("/products",createProduct)
server.listen(process.env.PORT, () => {
  console.log("hlw i am a server");
});
