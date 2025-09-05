import React from 'react'
import './App.css'

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import HomePage from './pages/home'
import Login from './pages/login'
import Register from './pages/register'
import UsedCars from './pages/usedcar'
import NewCars from './pages/newcars'
import Auction from './pages/auction'
import Sell from './pages/sell'
import SellNewCarForm from './pages/sellNewCarForm'
import SellUsedCarForm from './pages/sellUsedCarForm'
import AuctionCarForm from './pages/auctionCarForm'
import Dashboard from './pages/Dashboard'
import EditProfile from './pages/EditProfile'
import EditUserCar from './pages/EditUserCar'
import ContactSeller from './pages/contactSeller'
import EditReview from './pages/EditReview'
import TestDrive from './pages/TestDrive'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/dashboard/update' element={<EditProfile />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/usedcar' element={<UsedCars />} />
        <Route path='/newcars' element={<NewCars />} />
        <Route path='/auction' element={<Auction />} />
        <Route path='/sell' element={<Sell />} />
        <Route path='/sell/new' element={<SellNewCarForm />} />
        <Route path='/sell/used' element={<SellUsedCarForm />} />
        <Route path='/sell/auction' element={<AuctionCarForm />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/dashboard/editcar/:collection/:id' element={<EditUserCar />} />
        <Route path='/:collection/car/:id' element={<ContactSeller />} />
        <Route path='/dashboard/editreview/:id' element={<EditReview />} />
        <Route path='/:collection/testdrive/:id' element={<TestDrive />} />
      </Routes>
    </Router>
  )
}

export default App