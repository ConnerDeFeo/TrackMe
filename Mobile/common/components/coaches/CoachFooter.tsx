import React from 'react';
import Footer from '../Footer';

const buttons = [
    ['History', 'History'], 
    ['Relations', 'Relations'], 
    ['Profile', 'Profile']
  ]

//Footer at bottom of the coach screens with navigation buttons
const CoachFooter = () => {

    return (
        <Footer buttons={buttons} />
    );
};

export default CoachFooter;
