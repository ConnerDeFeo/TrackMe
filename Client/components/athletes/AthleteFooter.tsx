import React from 'react';
import Footer from '../Footer';

const buttons = [
    ['Inputs', 'Inputs'], 
    ['History', 'InputHistory'], 
    ['Groups', 'AthleteGroups'], 
    ['Coaches', 'Coaches'], 
    ['Profile', 'AthleteProfile']
  ]

//Footer for the athlete pages
const AthleteFooter = () => {
    return (
        <Footer buttons={buttons}/>
    );
};

export default AthleteFooter;