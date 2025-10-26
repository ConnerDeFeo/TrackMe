import React from 'react';
import Footer from '../Footer';

const buttons = [
    ['History', 'History'], 
    ['Relations', 'Relations'], 
    ['Profile', 'Profile']
  ]

//Footer at bottom of the coach screens with navigation buttons
const CoachFooter = ({currentRoute}:{currentRoute: string}) => {

    return (
        <Footer buttons={buttons} currentRoute={currentRoute} />
    );
};

export default CoachFooter;
