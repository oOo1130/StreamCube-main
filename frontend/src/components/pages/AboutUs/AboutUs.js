import React from 'react'
import reactDom from 'react-dom';
import {homeObjFour} from './Data3'
import { withRouter, Switch, Route} from 'react-router-dom';
import HeroSection3 from '../../HeroSection3';

function AboutUs() {
    return (
        <>
          <HeroSection3 {...homeObjFour} />   
        
        </>
    )
}



export default AboutUs;
