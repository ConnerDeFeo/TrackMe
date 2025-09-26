import React from 'react';
import Footer from '../../Footer';

const buttons = [
    ['Workouts', 'WorkoutTemplates'], 
    ['History', 'CoachHistory'], 
    ['Groups', 'CoachGroups'], 
    ['Athletes', 'Athletes'], 
    ['Profile', 'CoachProfile']
  ]

//Footer at bottom of the coach screens with navigation buttons
const CoachFooter = () => {

    return (
        <Footer buttons={buttons} />
    );
};

export default CoachFooter;
