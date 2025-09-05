import React from 'react'
import './Footer.css'

const Footer = () => {
  return (
    <div className='footer'>
      <div className="footerContainer container">
        <div className="footerMenuDiv grid">
          <div className="singleGrid">
            <span className="footerTitle">About</span>
            <ul className="footerUl grid">
              <li className="footerLi">How it Works</li>
              <li className="footerLi">Carrer</li>
              <li className="footerLi">Affliates</li>
              <li className="footerLi">Media</li>
            </ul>
          </div>
          <div className="singleGrid">
            <span className="footerTitle">Become Seller</span>
            <ul className="footerUl grid">
              <li className="footerLi">Add vehicles</li>
              <li className="footerLi">Resource Center</li>
              <li className="footerLi">Bonds</li>
              <li className="footerLi">Release Dates</li>
            </ul>
          </div>
          <div className="singleGrid">
            <span className="footerTitle">Comunity</span>
            <ul className="footerUl grid">
              <li className="footerLi">Recomendations</li>
              <li className="footerLi">Gift cards</li>
              <li className="footerLi">Top Ups</li>
              <li className="footerLi">Selling</li>
            </ul>
          </div>
          <div className="singleGrid">
            <span className="footerTitle">Booking Support</span>
            <ul className="footerUl grid">
              <li className="footerLi">Updates for Covid-19</li>
              <li className="footerLi">Garages</li>
              <li className="footerLi">Affliates</li>
              <li className="footerLi">Trust & Safety</li>
            </ul>
          </div>
        </div>
        <div className="lowerSection grid">
          <p>2023 All rights reserved</p>
          <blockquote>Terms & Conditions</blockquote>
        </div>
      </div>
    </div>
  )
}

export default Footer