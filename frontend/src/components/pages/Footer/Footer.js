import React from 'react';
import './Footer.css';
import { Button } from '../../Button';
import { ExternalLink } from 'react-external-link';
import { Link } from 'react-router-dom';
import {
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaTwitter,
  FaLinkedin
} from 'react-icons/fa';


function Footer() {
  return (
      <div className='footer-container'>
        <div className="container px-0">
          <div className="row">

              <div className="col-lg-8 col-12">
                <div className="row">
                    <div className="ml-0 text-left">&copy; StreamCube 2020 - {new Date().getFullYear()}, All Rights Reserved. </div>
                    <ul className="ml-1 list-inline">
                        <li className="list-inline-item"><Link to="TermsConditions">Terms &amp; Conditions |</Link></li>
                        <li className="list-inline-item"><Link to="PrivacyPolicy">Privacy Policy</Link></li>
                    </ul>
                </div>
              </div>

              <div className="col-lg-4 col-12">
                <div className='social-icons text-right'>
                  <a className='social-icon-link' href='//www.facebook.com/StreamCube-102166984657917/' target='_blank' aria-label='Facebook'>
                    <FaFacebook />
                  </a>
                  <a className='social-icon-link' href='//www.instagram.com/streamcube_uk/' target='_blank' aria-label='Instagram'>
                    <FaInstagram />
                  </a>
                  <a className='social-icon-link' href='//www.youtube.com/channel/UCGRqGcgQ21gmIXegXV12UQA' target='_blank' aria-label='Youtube'>
                    <FaYoutube />
                  </a>
                  <a className='social-icon-link' href='//www.linkedin.com/company/streamcube' target='_blank' aria-label='LinkedIn'>
                    <FaLinkedin />
                  </a>
                </div>           
              </div>
          </div>
        </div>
      </div>
      

  );
}

export default Footer;