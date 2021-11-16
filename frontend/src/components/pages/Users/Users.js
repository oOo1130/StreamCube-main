import React from 'react'
import reactDom from 'react-dom';
import {homeObjThree} from './Data2'
import { withRouter, Switch, Route} from 'react-router-dom';
import HeroSection2 from '../../HeroSection2';



function Users() {
  return (
      <>
        <HeroSection2 {...homeObjThree} />   
      
      </>
  )
}





export default withRouter (Users); 