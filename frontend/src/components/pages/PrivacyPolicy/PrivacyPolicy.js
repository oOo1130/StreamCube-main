import React from 'react'
import reactDom from 'react-dom';
import {homeObjFour} from './Data6'
import { withRouter, Switch, Route} from 'react-router-dom';
import HeroSection6 from '../../HeroSection6';

function PrivacyPolicy() {
    return (
        <>
          <HeroSection6 {...homeObjFour} />   
        
        </>
    )
}



export default PrivacyPolicy;
