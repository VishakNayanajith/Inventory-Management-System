import React, { useState } from "react";
import Nav from "./Nav/Nav";

export default function ScanBillPage() {
  const [image, setImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.match("image.*")) {
      setImage(URL.createObjectURL(file));
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1604591259953-e9b8d921a5c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="fixed top-0 left-0 right-0 z-50">
        <Nav />
      </div>

      <div className="bg-white bg-opacity-90 backdrop-filter backdrop-blur-sm shadow-2xl rounded-xl p-8 w-full max-w-md transition-all duration-300 hover:shadow-3xl">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Scan Your Bill
          </h1>
          <p className="text-gray-600">
            Upload a photo of your receipt to get started
          </p>
        </div>

        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center mb-6 transition-all duration-200 ${
            isDragging
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-blue-400"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <svg
              className="w-12 h-12 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="text-gray-600">
              {isDragging
                ? "Drop your bill here"
                : "Drag & drop your bill or click to browse"}
            </p>
            <label className="cursor-pointer">
              <span className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 inline-block">
                Select File
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </span>
            </label>
          </div>
        </div>

        {image && (
          <div className="mt-6 animate-fade-in">
            <p className="text-center text-gray-600 mb-3 font-medium">
              Bill Preview
            </p>
            <div className="relative pb-3/4 overflow-hidden rounded-lg border border-gray-200 shadow-sm">
              <img
                src={image}
                alt="Bill Preview"
                className="w-full h-auto rounded-lg object-contain max-h-64"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <button
                  className="bg-white text-blue-600 px-3 py-1 rounded text-sm font-medium hover:bg-blue-50 transition-colors"
                  onClick={() => setImage(null)}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        )}

        {image && (
          <button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 shadow-md hover:shadow-lg">
            Process Bill
          </button>
        )}
      </div>
    </div>
  );
}
