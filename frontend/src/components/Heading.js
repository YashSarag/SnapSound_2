import React from 'react'
import slogo from '../assets/S logo 3.2.png'

function Heading(){
  return (
    <div>
        <div className='logo'>
            <div className="logo-box">
                <img src={slogo} className="logo-img"/>
                <div className='logo-text'>napSound</div>
            </div>

            <div className='sub-heading'>
                AI Pod<br/>Converter
            </div>
        </div>
    </div>
  )
}

export default Heading;
