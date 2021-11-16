import React from 'react'
import reactDom from 'react-dom';
import {homeObjFour} from './Data5'
import { withRouter, Switch, Route} from 'react-router-dom';
import HeroSection5 from '../../HeroSection5';

function TermsConditions() {
    return (
        <>
          <HeroSection5 {...homeObjFour} />   
        
        </>
    )
}



export default TermsConditions;
