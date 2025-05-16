import React from "react";
import axios from "axios";

const DeleteStock = ({ stockCode, refreshStocks }) => {
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this stock?")) {
      try {
        await axios.delete(`http://localhost:5000/stocks/${stockCode}`);
        refreshStocks(); // Refresh the stock list after deletion
      } catch (error) {
        console.error("Error deleting stock:", error);
      }
    }
  };

  return (
    <button
      onClick={handleDelete}
      style={{
        backgroundColor: "red",
        color: "white",
        padding: "5px 10px",
        borderRadius: "5px",
        border: "none",
        cursor: "pointer",
      }}
    >
      Delete Stock
    </button>
  );
};

export default DeleteStock;
