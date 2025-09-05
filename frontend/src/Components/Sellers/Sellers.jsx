import React from 'react'
import './Sellers.css'
import sellerImage1 from '../../Assets/seller1.jpeg'
import sellerImage2 from '../../Assets/audilogo.png'
import sellerImage3 from '../../Assets/hyundailogo.png'
import sellerImage4 from '../../Assets/jaguarlogo.webp'

const Sellers = () => {
  return (
    <div className='sellers section'>
      <div className="secContainer container">
        <div className="secHeading grid">
          <h3 className="secTitle">
            Top Sellers
          </h3>
          <p>
            Joseph Samuel Girard holds the Guinness World Record for being the greatest salesman in the world.
          </p>
        </div>
        <div className="sellersContainer grid">
          { /*Single seller div*/}
          <div className="singleSeller flex">
            <div className="imgDiv flex">
              <img src={sellerImage1} alt="" className='img' />
            </div>
            <span className="info">
              <h4 className="name">
                Toyota
              </h4>
              <p>from $40K</p>
            </span>
          </div>
          { /*Single seller div*/}
          <div className="singleSeller flex">
            <div className="imgDiv flex">
              <img src={sellerImage2} alt="" className='img' />
            </div>
            <span className="info">
              <h4 className="name">
                Audi
              </h4>
              <p>from $40K</p>
            </span>
          </div>
          { /*Single seller div*/}
          <div className="singleSeller flex">
            <div className="imgDiv flex">
              <img src={sellerImage4} alt="" className='img' />
            </div>
            <span className="info">
              <h4 className="name">
                Jaguar
              </h4>
              <p>from $40K</p>
            </span>
          </div>
          { /*Single seller div*/}
          <div className="singleSeller flex">
            <div className="imgDiv flex">
              <img src={sellerImage3} alt="" className='img' />
            </div>
            <span className="info">
              <h4 className="name">
                Hyundai
              </h4>
              <p>from $40K</p>
            </span>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Sellers