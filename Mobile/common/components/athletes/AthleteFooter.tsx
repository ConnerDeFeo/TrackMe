import React from 'react';
import Footer from '../Footer';

const buttons = [
    ['Video', 'Video'],
    ['Inputs', 'Inputs'], 
    ['History', 'History'], 
    ['Relations', 'Relations'], 
    ['Profile', 'Profile']
  ]

//Footer for the athlete pages
const AthleteFooter = ({currentRoute}:{currentRoute: string}) => {
    return (
        <Footer buttons={buttons} currentRoute={currentRoute}/>
    );
};

export default AthleteFooter;