const express=require("express");
const { addToCart, fetchCartByUser, deleteFromCart, updateFromCart } = require("../controller/Cart");
const router=express.Router();
router.post("/",addToCart).get("/",fetchCartByUser).delete("/:id",deleteFromCart).patch("/:id",updateFromCart)
exports.router=router