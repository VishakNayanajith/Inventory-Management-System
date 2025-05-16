const express = require("express");
const router = express.Router();
const {
  getAllItems,
  addItem,
  getById,
  updateItem,
  deleteItem,
  getLowStockItems,
  notifyLowStock
} = require("../controllers/stockConroller");

// Define Routes
router.get("/", getAllItems);
router.post("/", addItem);
router.get("/:itemCode", getById);
router.put("/:itemCode", updateItem);
router.delete("/:itemCode", deleteItem);

// New low stock routes
router.get("/low-stock", getLowStockItems); // GET /stocks/low-stock
router.post("/low-stock/notify", notifyLowStock); // POST /stocks/low-stock/notify

module.exports = router;
