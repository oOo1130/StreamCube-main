import React from 'react'
import reactDom from 'react-dom';
import HeroSection1 from '../../HeroSection1'
import {homeObjTwo, homeObjFive, homeObjSix, homeObjSeven} from './Data1'
import { withRouter, Switch, Route} from 'react-router-dom';



function Businesses() {
  return (
      <>
        <HeroSection1 {...homeObjTwo} />   
        <HeroSection1 {...homeObjFive} />  
        <HeroSection1 {...homeObjSix} />
        <HeroSection1 {...homeObjSeven} />
         

      
      </>
  )
}





export default withRouter (Businesses); 