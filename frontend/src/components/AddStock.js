import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FiPlus, FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const AddStockPage = () => {
  const [stock, setStock] = useState({
    stockName: "",
    stockCode: "",
    quantity: "",
    price: "",
    stockDescription: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setStock({ ...stock, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!stock.stockName || !stock.stockCode) {
      Swal.fire("Error", "Stock name and code are required", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post("http://localhost:5000/stocks", stock);
      setStock({
        stockName: "",
        stockCode: "",
        quantity: "",
        price: "",
        stockDescription: "",
      });
      await Swal.fire(
        "Success!",
        "Stock has been added successfully",
        "success"
      );
      navigate("/viewstock");
    } catch (error) {
      console.error("Error adding stock:", error);
      let errorMessage = "Failed to add stock";
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = error.response.data.message;
      }
      Swal.fire("Error", errorMessage, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate("/")}
            className="flex items-center text-indigo-600 hover:text-indigo-800 mr-4"
          >
            <FiArrowLeft className="mr-1" /> Back to Stocks
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Add New Stock</h1>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock Name *
              </label>
              <input
                name="stockName"
                placeholder="e.g., Apple Inc."
                onChange={handleChange}
                value={stock.stockName}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock Code *
                </label>
                <input
                  name="stockCode"
                  placeholder="e.g., AAPL"
                  onChange={handleChange}
                  value={stock.stockCode}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <input
                  name="quantity"
                  placeholder="e.g., 100"
                  type="number"
                  onChange={handleChange}
                  value={stock.quantity}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-500">
                    $
                  </span>
                  <input
                    name="price"
                    placeholder="0.00"
                    type="number"
                    step="0.01"
                    onChange={handleChange}
                    value={stock.price}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="stockDescription"
                placeholder="Brief description about the stock..."
                onChange={handleChange}
                value={stock.stockDescription}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Adding...
                </>
              ) : (
                "Add Stock"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddStockPage;
