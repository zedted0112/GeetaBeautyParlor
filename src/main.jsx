import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/Home/Home';
import Book from './components/Book';
import ParlorSpace from './components/ParlorSpace'
import Layout from './Layout'

const Root = () => (
    <Router>
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route path='' element={<Home />} />
        <Route path='book' element={<Book />} />
        <Route path='me' element={<ParlorSpace />} />
        {/* Catch all undefined routes and redirect to homepage */}
        <Route path='*' element={<Navigate to='/' replace />} />
      </Route>
    </Routes>
  </Router>
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <Root />
)
