import React, { useState } from "react";
import axios from "axios";

const UpdateStock = ({ stock, refreshStocks }) => {
  const [updatedStock, setUpdatedStock] = useState(stock);

  const handleChange = (e) => {
    setUpdatedStock({ ...updatedStock, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://localhost:5000/stocks/${stock.stockCode}`,
        updatedStock
      );
      refreshStocks(); // Refresh the stock list after update
    } catch (error) {
      console.error("Error updating stock:", error);
    }
  };

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "20px",
        marginBottom: "20px",
      }}
    >
      <h2 className="text-xl font-semibold">Update Stock</h2>
      <input
        name="stockName"
        value={updatedStock.stockName}
        onChange={handleChange}
        placeholder="Stock Name"
        style={{ display: "block", margin: "5px 0", padding: "8px" }}
      />
      <input
        name="stockCode"
        value={updatedStock.stockCode}
        disabled
        style={{ display: "block", margin: "5px 0", padding: "8px" }}
      />
      <input
        name="quantity"
        value={updatedStock.quantity}
        onChange={handleChange}
        type="number"
        placeholder="Quantity"
        style={{ display: "block", margin: "5px 0", padding: "8px" }}
      />
      <input
        name="price"
        value={updatedStock.price}
        onChange={handleChange}
        type="number"
        step="0.01"
        placeholder="Price"
        style={{ display: "block", margin: "5px 0", padding: "8px" }}
      />
      <input
        name="stockDescription"
        value={updatedStock.stockDescription}
        onChange={handleChange}
        placeholder="Description"
        style={{ display: "block", margin: "5px 0", padding: "8px" }}
      />
      <button
        onClick={handleUpdate}
        style={{
          backgroundColor: "green",
          color: "white",
          padding: "10px",
          borderRadius: "5px",
          marginTop: "10px",
          cursor: "pointer",
        }}
      >
        Update Stock
      </button>
    </div>
  );
};

export default UpdateStock;
