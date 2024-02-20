import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Report from '../Report';
import Home from '../Home';
import Home2 from '../Home2';
import Login from '../Login/login';
import Signup from '../Login/signup'
import Navbar2 from '../Navbar/Navbar2';
import Table from '../Table';
import Temperature from '../Temperature';




function RoutersManager() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/Home' element={<Home />} />
          <Route path='/Report' element={<Report />} />
          <Route path='/Home2' element={<Home2 />} />
          <Route path='/Navbar2' element={<Navbar2 />} />
          <Route path='/Table' element={<Table />} />
          <Route path='/Temperature' element={<Temperature />} />
         

        </Routes>
      </BrowserRouter>
    </div>
  );
}
export default RoutersManager
