import React from 'react';
import Footer from '../Footer';

const buttons = [
    ['Inputs', 'Inputs'], 
    ['History', 'History'], 
    ['Groups', 'AthleteGroups'], 
    ['Relations', 'Relations'], 
    ['Profile', 'AthleteProfile']
  ]

//Footer for the athlete pages
const AthleteFooter = () => {
    return (
        <Footer buttons={buttons}/>
    );
};

export default AthleteFooter;