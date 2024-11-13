



import React from 'react'
import '../App.css'
import {LiaInstagram} from 'react-icons/lia'
import {LiaFacebook} from 'react-icons/lia'
import {CiTwitter} from 'react-icons/ci'
import { BiLogoGmail } from "react-icons/bi";
import { BsBrowserChrome } from "react-icons/bs";
import { FaInstagram } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";
import { GrInstagram } from "react-icons/gr";
import { FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
<footer id="footer">

 

  <div className="cpy">
    <p>  Developed by Ariakash S Information Technology Dr.Sacoe (2021-25).All rights reserved</p>
  </div>
  <div className="ftSocials">
  <li><a href="mailto:ariakash067@gmail.com"><BiLogoGmail /></a></li>


  <li><a href="https://erp.aei.edu.in/"><BsBrowserChrome /></a></li>


  <li><a href="https://www.youtube.com/@drsacoeofficial1886"><FaYoutube /></a></li>
  <li><a href="https://x.com/drsacoe?lang=en"><FaXTwitter /></a></li>
  </div>
</footer>
  )
}

export default Footer


{
  /*{(new Date().getFullYear())}  */
}