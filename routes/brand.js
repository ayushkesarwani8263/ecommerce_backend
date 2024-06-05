const express=require("express")
const { fetchBrands, createBrand } = require("../controller/brand")
const router=express.Router()
router.get("/",fetchBrands).post("/",createBrand)
exports.rotuer=router;