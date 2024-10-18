import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';  // Custom styles
import Template from './component/template/Template';
import Marksheet from './component/marksheet/Marksheet';
import 'bootstrap/dist/css/bootstrap.min.css';
import EntryMark from './component/entry_mark/EntryMark';

const App = () => {
  return (
    <Router>
      <div className="container-fluid p-0 bodyy">
        {/* Fixed Top Navbar for all devices */}
        <nav className="navbar navbar-expand-md navbar-expand-smd navbar-dark bg-primary fixed-top">
          <div className="container-fluid">
            <a className="navbar-brand" href="/">
              <img src="/path/to/logo.png" alt="Logo" className="img-fluid" style={{ width: '30px' }} />
            </a>
            <div className="collapse navbar-collapse">
              <ul className="navbar-nav mx-auto">
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/">Home</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/about">About</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/Entry_mark">Entry Mark</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/Marksheet">Marksheet</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/template">Template</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        {/* Fixed Heading Below Navbar */}
        <div className="bg-gray p-3 text-center header rounded fixed-top" >
          <h1 className="display-6 text-white">Sacoe IT Department</h1>
        </div>

        {/* Main content area */}
        <div className="content " style={{ marginTop: '8rem' }}>
          <Routes>
            <Route path="/Template" element={<Template />} />
            <Route path="/Marksheet" element={<Marksheet />} />
            <Route path="/Entry_mark" element={<EntryMark />} />
            <Route path="/" element={<h2>Welcome to Sacoe IT Department</h2>} /> {/* Default Route */}
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
