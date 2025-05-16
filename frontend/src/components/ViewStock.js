import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FiSearch,
  FiX,
  FiRefreshCw,
  FiPlus,
  FiAlertTriangle,
  FiDownload,
} from "react-icons/fi";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import Nav from "./Nav/Nav";

const ViewStock = () => {
  const [stocks, setStocks] = useState([]);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [editingStock, setEditingStock] = useState(null);
  const [updatedStock, setUpdatedStock] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [showNotification, setShowNotification] = useState(true);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const navigate = useNavigate();

  // Fetch Stocks with low stock check
  const fetchStocks = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/stocks");
      const allStocks = response.data.stocks || [];
      setStocks(allStocks);
      setFilteredStocks(allStocks);

      // Check for low stock items (quantity < 20)
      const lowStock = allStocks.filter((stock) => stock.quantity < 20);
      setLowStockItems(lowStock);

      // Show notification if there are low stock items
      if (lowStock.length > 0 && showNotification) {
        Swal.fire({
          title: "Low Stock Alert!",
          html: `<div class="text-left">
                  <p>You have ${lowStock.length} item(s) with low stock:</p>
                  <ul class="mt-2 pl-5 list-disc">
                    ${lowStock
                      .map(
                        (item) =>
                          `<li><strong>${item.stockName}</strong> (${item.stockCode}): ${item.quantity} remaining</li>`
                      )
                      .join("")}
                  </ul>
                </div>`,
          icon: "warning",
          confirmButtonText: "OK",
          footer:
            '<a class="text-sm text-gray-500 hover:text-gray-700" onclick="document.querySelector(\'.swal2-confirm\').click(); return false;">Don\'t show again</a>',
        }).then((result) => {
          if (result.isConfirmed) {
            setShowNotification(false);
          }
        });
      }
    } catch (error) {
      console.error("Error fetching stocks:", error);
      Swal.fire("Error!", "Failed to load stocks.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sending email notification
  const handleSendEmailNotification = async () => {
    setIsSendingEmail(true);
    try {
      const { isConfirmed } = await Swal.fire({
        title: "Send Notification?",
        text: `This will email ${lowStockItems.length} low-stock item(s) to your team.`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#4f46e5",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, send it!",
      });

      if (isConfirmed) {
        const response = await axios.post(
          "http://localhost:5000/stocks/low-stock/notify"
        );
        Swal.fire({
          title: "Notification Sent!",
          text: response.data.message || "Low stock alert sent successfully",
          icon: "success",
        });
      }
    } catch (error) {
      console.error("Error sending notification:", error);
      Swal.fire(
        "Error!",
        error.response?.data?.message || "Failed to send notification",
        "error"
      );
    } finally {
      setIsSendingEmail(false);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  // Handle search
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredStocks(stocks);
    } else {
      const filtered = stocks.filter(
        (stock) =>
          stock.stockName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          stock.stockCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
          stock.stockDescription
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
      setFilteredStocks(filtered);
    }
  }, [searchTerm, stocks]);

  // Enable Editing
  const handleEdit = (stock) => {
    setEditingStock(stock.stockCode);
    setUpdatedStock({ ...stock });
  };

  // Handle Input Changes
  const handleChange = (e) => {
    setUpdatedStock({ ...updatedStock, [e.target.name]: e.target.value });
  };

  // Save Updates with SweetAlert
  const handleSave = async () => {
    try {
      const { isConfirmed } = await Swal.fire({
        title: "Confirm Update",
        text: "Are you sure you want to update this stock?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#4f46e5",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, update it!",
      });

      if (isConfirmed) {
        await axios.put(
          `http://localhost:5000/stocks/${updatedStock.stockCode}`,
          updatedStock
        );
        setEditingStock(null);
        fetchStocks();

        await Swal.fire("Updated!", "Your stock has been updated.", "success");
      }
    } catch (error) {
      console.error("Error updating stock:", error);
      Swal.fire("Error!", "Failed to update stock.", "error");
    }
  };

  // Delete Stock with SweetAlert
  const handleDelete = async (stockCode) => {
    try {
      const { isConfirmed } = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#4f46e5",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (isConfirmed) {
        await axios.delete(`http://localhost:5000/stocks/${stockCode}`);
        fetchStocks();

        await Swal.fire("Deleted!", "Your stock has been deleted.", "success");
      }
    } catch (error) {
      console.error("Error deleting stock:", error);
      Swal.fire("Error!", "Failed to delete stock.", "error");
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm("");
  };

  // PDF
  const generatePDF = () => {
    if (lowStockItems.length === 0) {
      Swal.fire("Info", "No low stock items to export", "info");
      return;
    }
  
    try {
      // Initialize jsPDF
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(18);
      doc.text("Low Stock Report", 14, 22);
  
      // Add date
      doc.setFont("helvetica");
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
  
      // Add table using autoTable
      autoTable(doc, {
        head: [["Name", "Code", "Quantity", "Price", "Description"]],
        body: lowStockItems.map((item) => [
          item.stockName,
          item.stockCode,
          item.quantity,
          `$${item.price?.toFixed(2)}`,
          item.stockDescription.substring(0, 50) + (item.stockDescription.length > 50 ? "..." : ""),
        ]),
        startY: 40,
        styles: {
          fontSize: 9,
          cellPadding: 2,
          overflow: "linebreak",
        },
        headStyles: {
          fillColor: [79, 70, 229], // indigo-600
          textColor: 255,
          fontStyle: "bold",
        },
        columnStyles: {
          0: { cellWidth: 35 }, // Name
          1: { cellWidth: 20 }, // Code
          2: { cellWidth: 15 }, // Quantity
          3: { cellWidth: 15 }, // Price
          4: { cellWidth: "auto" }, // Description
        },
      });
  
      // Save the PDF
      doc.save(`low-stock-report-${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (error) {
      console.error("PDF generation failed:", error);
      Swal.fire("Error", "Failed to generate PDF report", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Nav />
      </div>

      {/* Main Content - pushed down by the fixed nav */}
      <div className="pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-indigo-600 mb-2">
              Stock Management System
            </h1>
            <p className="text-lg text-gray-600">
              Manage your inventory with ease
            </p>
          </div>

          {/* Low Stock Warning Banner */}
          {lowStockItems.length > 0 && (
            <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
              <div className="flex items-start justify-between">
                <div className="flex items-start">
                  <FiAlertTriangle className="text-yellow-400 text-xl mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-medium text-yellow-800">
                      Low Stock Alert
                    </h3>
                    <p className="text-yellow-700 mb-2">
                      You have {lowStockItems.length} item(s) with stock below 20.
                    </p>
                    <ul className="list-disc pl-5 text-yellow-700">
                      {lowStockItems.map((item) => (
                        <li key={item.stockCode}>
                          <span className="font-medium">{item.stockName}</span> (
                          {item.stockCode}): {item.quantity} remaining
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <button
                  onClick={handleSendEmailNotification}
                  disabled={isSendingEmail}
                  className={`flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition text-sm ${
                    isSendingEmail ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isSendingEmail ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                      Sending...
                    </>
                  ) : (
                    <>
                      <FiAlertTriangle />
                      Notify Team
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Search and Add Section */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search stocks by name, code or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <FiX className="text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => navigate("/add")}
                className="flex items-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition"
              >
                <FiPlus />
                Add Stock
              </button>
              <button
                onClick={fetchStocks}
                disabled={isLoading}
                className={`flex items-center gap-2 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                <FiRefreshCw className={`${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </button>
              {lowStockItems.length > 0 && (
                <>
                  <button
                    onClick={handleSendEmailNotification}
                    disabled={isSendingEmail}
                    className={`flex items-center gap-2 px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition ${
                      isSendingEmail ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {isSendingEmail ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                        Sending...
                      </>
                    ) : (
                      <>
                        <FiAlertTriangle />
                        Notify Team
                      </>
                    )}
                  </button>
                  <button
                    onClick={generatePDF}
                    className="flex items-center gap-2 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
                  >
                    <FiDownload />
                    Export PDF
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Stock Table */}
          <div className="bg-white shadow-lg rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-indigo-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-indigo-600 uppercase tracking-wider">
                      Stock Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-indigo-600 uppercase tracking-wider">
                      Code
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-indigo-600 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-indigo-600 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-indigo-600 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-indigo-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStocks.length > 0 ? (
                    filteredStocks.map((stock) => (
                      <tr
                        key={stock.stockCode}
                        className={`hover:bg-gray-50 ${
                          stock.quantity < 20 ? "bg-yellow-50" : ""
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          {editingStock === stock.stockCode ? (
                            <input
                              name="stockName"
                              value={updatedStock.stockName}
                              onChange={handleChange}
                              className="border px-3 py-2 rounded w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                          ) : (
                            <div className="flex items-center text-sm font-medium text-gray-900">
                              {stock.quantity < 20 && (
                                <FiAlertTriangle className="text-yellow-500 mr-2" />
                              )}
                              {stock.stockName}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500 font-mono">
                            {stock.stockCode}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {editingStock === stock.stockCode ? (
                            <input
                              name="quantity"
                              type="number"
                              value={updatedStock.quantity}
                              onChange={handleChange}
                              className="border px-3 py-2 rounded w-full max-w-24 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                          ) : (
                            <div
                              className={`text-sm ${
                                stock.quantity < 20
                                  ? "font-semibold text-yellow-700"
                                  : "text-gray-900"
                              }`}
                            >
                              {stock.quantity}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {editingStock === stock.stockCode ? (
                            <input
                              name="price"
                              type="number"
                              step="0.01"
                              value={updatedStock.price}
                              onChange={handleChange}
                              className="border px-3 py-2 rounded w-full max-w-24 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                          ) : (
                            <div className="text-sm text-gray-900">
                              ${parseFloat(stock.price).toFixed(2)}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {editingStock === stock.stockCode ? (
                            <input
                              name="stockDescription"
                              value={updatedStock.stockDescription}
                              onChange={handleChange}
                              className="border px-3 py-2 rounded w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                          ) : (
                            <div className="text-sm text-gray-500 line-clamp-2">
                              {stock.stockDescription}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {editingStock === stock.stockCode ? (
                            <button
                              onClick={handleSave}
                              className="text-indigo-600 hover:text-indigo-900 mr-4"
                            >
                              Save
                            </button>
                          ) : (
                            <button
                              onClick={() => handleEdit(stock)}
                              className="text-indigo-600 hover:text-indigo-900 mr-4"
                            >
                              Edit
                            </button>
                          )}
                          {editingStock !== stock.stockCode && (
                            <button
                              onClick={() => handleDelete(stock.stockCode)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        {isLoading ? (
                          <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                          </div>
                        ) : (
                          "No stocks found matching your search"
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewStock;