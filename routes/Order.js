const express = require("express");
const {
  CreateOrder,
  fetchOrderByUser,
  deleteOrder,
  updateOrder,
  fetchAllOrders,
} = require("../controller/Order");
// const { createUser,loginUser} = require("../controller/Auth");
const router = express.Router();
router
  .post("/", CreateOrder)
  .get("/own", fetchOrderByUser)
  .delete("/:id", deleteOrder)
  .patch("/:id", updateOrder)
  .get("/",fetchAllOrders)
exports.router = router;
