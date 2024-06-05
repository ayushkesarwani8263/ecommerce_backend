const express=require("express");
const { createProduct, fetchAllProduct, fetchProductById, UpdateProduct } = require("../controller/Product");
const router=express.Router();
router.post("/",createProduct)
      .get("/",fetchAllProduct)
      .get("/:id",fetchProductById)
      .patch("/:id",UpdateProduct)
exports.router=router;
