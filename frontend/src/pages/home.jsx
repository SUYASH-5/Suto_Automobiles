import React from 'react'


import Navbar from "../Components/Navbar/Navbar.jsx"
import Home from '../Components/Home/Home.jsx'
import Search from '../Components/Search/Search.jsx'
import Trending from '../Components/Trending/Trending.jsx'
import Sellers from '../Components/Sellers/Sellers.jsx'
import Auction from '../Components/Auction/Auction.jsx'
import Review from '../Components/Review/Review.jsx'
import Footer from '../Components/Footer/Footer.jsx'


const HomePage = () => {
    return (
        <div>
            <Navbar />
            <Home />
            <Search />
            <Trending />
            <Sellers />
            <Auction />
            <Review />
            <Footer />
        </div>
    )
}

export default HomePage