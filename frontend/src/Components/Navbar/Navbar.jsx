import React, { useState, useEffect } from 'react'
import './Navbar.css'
import { useNavigate } from 'react-router-dom';

//image import kro
import logo from '../../Assets/logo1.png'

//imported icons
import { TbGridDots } from "react-icons/tb"
import { IoIosCloseCircle } from "react-icons/io";

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  //statement to hold navbar state
  const [navbar, setNavbar] = useState('navbar')

  //function for showing navbar on smaller width screens
  const showNavbar = () => {
    setNavbar('navbar showNavbar')
  }

  //function for removing navbar on smaller with screen
  const removeNavbar = () => {
    setNavbar('navbar')
  }

  const [header, setHeader] = useState('header')
  const addBg = () => {
    if (window.scrollY >= 20) {
      setHeader('header addBg')
    } else {
      setHeader('header')
    }
  }
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    setIsLoggedIn(!!token);
    if (user) {
      setUserName(user.username);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    navigate('/');
  };

  window.addEventListener('scroll', addBg)

  return (
    <div className={header}>
      <div className="logoDiv">
        <a href="/">
          <img src={logo} alt='Logo Image' className='logo' />
        </a>
      </div>

      <div className={navbar}>
        <ul className='menu'>
          <li onClick={removeNavbar} className='listItem'>
            <a href="/usedcar" className='link'>Used Cars</a>
          </li>
          <li onClick={removeNavbar} className='listItem'>
            <a href="/newcars" className='link'>New Cars</a>
          </li>
          <li onClick={removeNavbar} className='listItem'>
            <a href="/auction" className='link'>Auctions</a>
          </li>
          <li onClick={removeNavbar} className='listItem'>
            <a href="/sell" className='link'>Sell</a>
          </li>

        </ul>
        <IoIosCloseCircle className='icon closeIcon' onClick={removeNavbar} />

      </div>
      <div className='signUp flex'>
        {isLoggedIn ? (
          <>
            <div className='text userName' onClick={() => navigate('/dashboard')}>{userName}</div>
            <div className='text logout' onClick={handleLogout}>Logout</div>
          </>
        ) : (
          <a href='/login'><div className='text'>Login</div></a>
        )}
        <TbGridDots className='icon toggleNavbarIcon' onClick={showNavbar} />
      </div>

    </div>
  )
}

export default Navbar