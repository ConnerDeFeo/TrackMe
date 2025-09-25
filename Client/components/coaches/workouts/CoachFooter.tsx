import React from 'react';
import { AccountType } from '../../../assets/constants/Enums';
import Footer from '../../Footer';

const buttons = [
    ['Workouts', 'WorkoutTemplates'], 
    ['History', 'CoachHistory'], 
    ['Groups', 'CoachGroups'], 
    ['Athletes', 'Athletes'], 
    ['Profile', 'CoachProfile']
  ]

//Footer at bottom of the screen with navigation buttons
const CoachFooter = () => {

    return (
        <Footer buttons={buttons} />
    );
};

export default CoachFooter;
