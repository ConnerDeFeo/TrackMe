import React from 'react';
import Footer from '../Footer';

const buttons = [
    ['Template', 'WorkoutTemplates'], 
    ['History', 'CoachHistory'], 
    ['Groups', 'CoachGroups'], 
    ['Relations', 'Relations'], 
    ['Profile', 'CoachProfile']
  ]

//Footer at bottom of the coach screens with navigation buttons
const CoachFooter = () => {

    return (
        <Footer buttons={buttons} />
    );
};

export default CoachFooter;
