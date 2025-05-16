import React from "react";
import { Link } from "react-router-dom";
import Nav from "../Nav/Nav";

function Home() {
  return (
    <div className="relative min-h-screen">
      {/* Background with overlay */}
      <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1556740738-b6a63e27c4df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')",
        }}
      ></div>

      <div className="relative z-10">
        <Nav />

        <main className="flex flex-col items-center justify-center text-center px-4 py-20 sm:py-32 text-white">
          <div className="max-w-4xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Optimize Your Inventory With Our{" "}
              <span className="text-blue-300">Stock Management System</span>
            </h1>

            <p className="text-xl sm:text-2xl mb-10 leading-relaxed">
              Gain real-time visibility and control over your inventory with our comprehensive
              warehouse management platform
            </p>

          </div>

          {/* Features Section */}
          <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-xl shadow-2xl p-8 max-w-6xl w-full mt-10 text-gray-800">
            <h2 className="text-3xl font-bold mb-10 text-blue-900">
              Key Features
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 rounded-lg hover:bg-blue-50 transition duration-300">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Inventory Tracking</h3>
                <p className="text-gray-600">
                  Real-time monitoring of all stock movements, quantities, and locations
                </p>
              </div>

              <div className="p-6 rounded-lg hover:bg-blue-50 transition duration-300">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Automated Reordering
                </h3>
                <p className="text-gray-600">
                  Smart alerts and purchase orders when stock reaches threshold levels
                </p>
              </div>

              <div className="p-6 rounded-lg hover:bg-blue-50 transition duration-300">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Analytics Dashboard
                </h3>
                <p className="text-gray-600">
                  Powerful reporting tools to analyze sales trends and inventory turnover
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-16 text-white">
            <h3 className="text-2xl font-semibold mb-4">
              Ready to transform your inventory management?
            </h3>
            <Link
              to="/register"
              className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-lg transition duration-300"
            >
              Request Demo
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Home;