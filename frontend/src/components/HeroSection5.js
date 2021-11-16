import React from 'react';
import './HeroSection.css';
import { Button } from './Button';
import { ExternalLink } from 'react-external-link';
import parse from 'html-react-parser';


function HeroSection5({ lightBg, topLine, lightText, lightTextDesc, headline, description, buttonLabel, img, alt, imgStart}) {
  return (
    <>
      <div
        className={lightBg ? 'home__hero-section' : 'home__hero-section darkBg'}>
        <div className='container'>
          <div
            className='row home__hero-row'
            style={{
              display: 'flex',
              flexDirection: imgStart === 'start' ? 'row-reverse' : 'row'
            }}
          >
            <div className='col-12'>
              <div className='text-wrapper'>
                <h1 className={lightText ? 'heading text-center' : 'heading dark'}>
                  {headline}
                </h1>
                <p className='text-left'>                  
                {parse(description)}
                </p>
                 
              </div>
            </div>


          </div>
        </div>
      </div>

      
    </>
  );
}

export default HeroSection5;