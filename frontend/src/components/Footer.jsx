



import React from 'react'
import '../App.css'
import {LiaInstagram} from 'react-icons/lia'
import {LiaFacebook} from 'react-icons/lia'
import {CiTwitter} from 'react-icons/ci'
const Footer = () => {
  return (
<footer id="footer">

 

  <div className="cpy">
    <p>  Developed by Ariakash S Information Technology Dr.Sacoe (2021-25).All rights reserved</p>
  </div>
  <div className="ftSocials">
  <li><a href="https://www.facebook.com/"><LiaFacebook/></a></li>
  <li><a href="https://www.instagram.com/i_am_akash._._/"><LiaInstagram/></a></li>
  <li><a href="https://www.twitter.com/"><CiTwitter/></a></li>
  </div>
</footer>
  )
}

export default Footer


{
  /*{(new Date().getFullYear())}  */
}