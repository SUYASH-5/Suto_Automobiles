import React from 'react'
import './Trending.css'

//imported icons
import { BsArrowLeftShort } from 'react-icons/bs'
import { BsArrowRightShort } from 'react-icons/bs'

//imported images
import car1 from '../../Assets/image4.png'
//import car2 from '../../Assets/image6.png'
//import car3 from '../../Assets/image7.png'

const Trending = () => {
  return (
    <div className='trending section'>
      <div className='secContainer container'>
        <div className='secHeading flex'>
          <h3 className='secTitle'>
            Trending Near You
          </h3>

          <div className='navBtns flex'>
            <BsArrowLeftShort className='icon leftIcon' />
            <BsArrowRightShort className='icon rightIcon' />



          </div>
        </div>
        <div className='carContainer grid'>
          {/*Single car div*/}
          <div className='singleCar grid '>
            <div className='imgDiv'>
              <img src={car1} alt="Car Image" />
            </div>
            <h5 className='carTitle'>
              Used 2019 Audi S4 Premium Plus
            </h5>
            <span className='miles'>
              17543 Miles

            </span>
            <span className='AWD'>
              AWD 4-Cylinder Turbo
            </span>

            <div className='price_seller flex'>
              <span className='price'>
                999999
              </span>
              <span className="seller">
                Best Seller
              </span>
            </div>
          </div>
          {/*Single car div*/}
          <div className='singleCar grid '>
            <div className='imgDiv'>
              <img src={car1} alt="Car Image" />
            </div>
            <h5 className='carTitle'>
              Used 2019 Audi S4 Premium Plus
            </h5>
            <span className='miles'>
              17543 Miles

            </span>
            <span className='AWD'>
              AWD 4-Cylinder Turbo
            </span>

            <div className='price_seller flex'>
              <span className='price'>
                999999
              </span>
              <span className="seller">
                Best Seller
              </span>
            </div>
          </div>
          {/*Single car div*/}
          <div className='singleCar grid '>
            <div className='imgDiv'>
              <img src={car1} alt="Car Image" />
            </div>
            <h5 className='carTitle'>
              Used 2019 Audi S4 Premium Plus
            </h5>
            <span className='miles'>
              17543 Miles

            </span>
            <span className='AWD'>
              AWD 4-Cylinder Turbo
            </span>

            <div className='price_seller flex'>
              <span className='price'>
                999999
              </span>
              <span className="seller">
                Best Seller
              </span>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Trending