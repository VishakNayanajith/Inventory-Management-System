import React from 'react';
import './nav.css';
import { Link } from 'react-router-dom';

function Nav() {
  return (
    <nav className="navbar">
      <ul className="nav-list">
        <li className="nav-item">
          <Link to="/home" className="nav-link">Home</Link>
        </li>
        <li className="nav-item">
          <Link to="/viewstock" className="nav-link">Stock Management</Link>
        </li>
        <li className="nav-item">
          <Link to="/billscan" className="nav-link">Scan Bill</Link>
        </li>
        <li className="nav-item">
          <Link to="/" className="nav-link">Logout</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Nav;

