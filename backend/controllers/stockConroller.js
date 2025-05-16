const Stock = require("../models/stockModel");
const { sendLowStockEmail } = require("../services/emailService"); // Optional for email notifications

// Get all stocks
const getAllItems = async (req, res) => {
  try {
    const stocks = await Stock.find();
    if (!stocks.length) {
      return res.status(404).json({ message: "No stocks found" });
    }
    return res.status(200).json({ stocks });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get low stock items
const getLowStockItems = async (req, res) => {
  try {
    const threshold = req.query.threshold || 20; // Default threshold is 20
    const lowStockItems = await Stock.find({
      quantity: { $lt: threshold },
    }).sort({ quantity: 1 }); // Sort by quantity (lowest first)

    return res.status(200).json({
      success: true,
      count: lowStockItems.length,
      items: lowStockItems,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Failed to get low stock items",
    });
  }
};

// Add a new stock
const addItem = async (req, res) => {
  const { stockName, stockCode, quantity, price, stockDescription } = req.body;

  try {
    // Check if stockCode already exists
    const existingStock = await Stock.findOne({ stockCode });
    if (existingStock) {
      return res
        .status(400)
        .json({ message: "Stock with this code already exists" });
    }

    const newStock = new Stock({
      stockName,
      stockCode,
      quantity,
      price,
      stockDescription,
    });

    await newStock.save();

    // Check for low stock after adding new item
    if (quantity < 20) {
      const lowStockItems = await Stock.find({ quantity: { $lt: 20 } });
      // Optionally send email notification
      // await sendLowStockEmail(lowStockItems);
    }

    return res.status(201).json({ stock: newStock });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to add stock" });
  }
};

// Get stock by Stock Code
const getById = async (req, res) => {
  try {
    const stock = await Stock.findOne({ stockCode: req.params.itemCode });

    if (!stock) {
      return res.status(404).json({ message: "Stock not found" });
    }

    return res.status(200).json({ stock });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Update stock by Stock Code
const updateItem = async (req, res) => {
  try {
    const updatedStock = await Stock.findOneAndUpdate(
      { stockCode: req.params.itemCode },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedStock) {
      return res.status(404).json({ message: "Stock not found" });
    }

    // Check for low stock after update
    if (req.body.quantity !== undefined && req.body.quantity < 20) {
      const lowStockItems = await Stock.find({ quantity: { $lt: 20 } });
      // Optionally send email notification
      // await sendLowStockEmail(lowStockItems);
    }

    return res.status(200).json({ stock: updatedStock });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to update stock" });
  }
};

// Delete stock by Stock Code
const deleteItem = async (req, res) => {
  try {
    const deletedStock = await Stock.findOneAndDelete({
      stockCode: req.params.itemCode,
    });

    if (!deletedStock) {
      return res.status(404).json({ message: "Stock not found" });
    }

    // Check if we have any low stock items after deletion
    const lowStockItems = await Stock.find({ quantity: { $lt: 20 } });
    if (lowStockItems.length > 0) {
      // Optionally send email notification
      // await sendLowStockEmail(lowStockItems);
    }

    return res.status(200).json({ message: "Stock deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Send low stock notifications (manual trigger)
const notifyLowStock = async (req, res) => {
  try {
    const lowStockItems = await Stock.find({ quantity: { $lt: 20 } });

    if (lowStockItems.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No low stock items found",
      });
    }

    // Uncomment to enable email notifications
    // await sendLowStockEmail(lowStockItems);

    return res.status(200).json({
      success: true,
      message: `Low stock notification sent for ${lowStockItems.length} items`,
      items: lowStockItems,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Failed to send low stock notifications",
    });
  }
};

// Export controllers
module.exports = {
  getAllItems,
  getLowStockItems,
  addItem,
  getById,
  updateItem,
  deleteItem,
  notifyLowStock,
};
