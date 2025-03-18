import React from 'react'
import logo from "../assets/logo.webp"

function Logo({width = "100px"}) {
  return (
    <img src= {logo} className='max-w-40 rounded-4xl' alt="logo" />
  )
}

export default Logo