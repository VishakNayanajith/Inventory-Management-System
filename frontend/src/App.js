import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ViewStock from './components/ViewStock';
import AddStock from './components/AddStock';
import UpdateStock from './components/UpdateStock';
import DeleteStock from './components/DeleteStock';
import './App.css';
import RegisterForm from "./components/Register/RegisterForm";
import LoginForm from "./components/Login/LoginForm";
import Home from "./components/UserHomePage/Home";
import ScanBillPage from "./components/ScanBillPage";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path ="/home" element={<Home/>}/>
          <Route path ="/billscan" element={<ScanBillPage/>}/>
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/" element={<LoginForm />} />
          <Route path="/viewstock" element={<ViewStock />} />
          <Route path="/add" element={<AddStock />} />
          <Route path="/update/:itemCode" element={<UpdateStock />} />
          <Route path="/delete/:itemCode" element={<DeleteStock />} />         
        </Routes>
      </div>
    </Router>
  );
}

export default App;