import { useEffect, useState } from "react";
import CoachWorkoutService from "../services/CoachWorkoutService";
import DisplayWorkout from "../common/components/display/workout/DisplayWorkout";
import TrackmeButton from "../common/components/TrackmeButton";
import WorkoutCreation from "../common/components/workout/WorkoutCreation";
import type { Workout } from "../common/types/workouts/Workout";
import type { WorkoutSummary } from "../common/types/workouts/WorkoutSummary";
import TemplatesSideBar from "../common/components/display/TemplatesSideBar";
import SectionCreation from "../common/components/workout/SectionCreation";
import type { Section } from "../common/types/workouts/Section";
import SectionTemplateCreation from "../common/components/workout/SectionTemplateCreation";
import DisplaySection from "../common/components/display/workout/DisplaySection";

const Templates = () => {
  // State: list of workouts fetched from the server
  const [workoutSummaries, setWorkoutSummaries] = useState<WorkoutSummary[]>([]);
  // Section Previews
  const [sectionPreviews, setSectionPreviews] = useState<{id: string, name: string}[]>([]);
  // State: currently selected workout template
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | undefined>(undefined);
  // State: currently selected workout template
  const [selectedSection, setSelectedSection] = useState<Section | undefined>(undefined);
  // State: loading flag for spinners/UI feedback
  const [loading, setLoading] = useState(true);
  // State: whether we're in "create workout template" mode
  const [inWorkoutTemplateCreationMode, setInWorkoutTemplateCreationMode] = useState(false);
  // State: whether we're in "create section template" mode
  const [inSectionTemplateCreationMode, setInSectionTemplateCreationMode] = useState(false);
  // State: which tab is selected in the sidebar (workout vs section)
  const [selectedTab, setSelectedTab] = useState<'workout' | 'section'>('workout');

  const fetchWorkout = async (workoutId: string) => {
    const resp = await CoachWorkoutService.getWorkout(workoutId);
    if (resp.ok) {
      const data = await resp.json();
      setSelectedWorkout(data);
    }else{
      setSelectedWorkout(undefined);
    }
  };

  // Fetch workout templates from API and update state
  const fetchWorkoutTemplates = async () => {
    setLoading(true);
    const response = await CoachWorkoutService.getWorkoutTemplates();
    if (response.ok) {
      const data = await response.json();
      // Auto-select the first workout if available, otherwise clear selection
        fetchWorkout(data[0].workoutId); 
        setWorkoutSummaries(data);
    }else {
      // On error, clear list and selection
      setWorkoutSummaries([]);
      setSelectedWorkout(undefined);
    }
    setLoading(false);
  }

  //Fetches preview of section templates
  const fetchSectionTemplates = async () => {
    setLoading(true);
    const resp = await CoachWorkoutService.previewSectionTemplates();
    if( resp.ok ){
      const data = await resp.json();
      console.log("Section Templates Preview:", data);
      setSectionPreviews(data);
    }
    setLoading(false);
  };

  // Load templates on component mount
  useEffect(() => {
    if(selectedTab === 'workout'){
      setSelectedSection(undefined);
      setInSectionTemplateCreationMode(false);
      fetchWorkoutTemplates();
    }else{
      setSelectedWorkout(undefined);
      setInWorkoutTemplateCreationMode(false);
      fetchSectionTemplates();
    }
  }, [selectedTab]);

  // Handler: select a workout from the sidebar
  const handleSelectWorkout = async (workoutId: string) => {
    await fetchWorkout(workoutId);
    setInWorkoutTemplateCreationMode(false);
  };

  // Handler: save (create or update) a workout template
  const handleWorkoutSave = async (workout: Workout) => {
    const resp = await CoachWorkoutService.createWorkoutTemplate(workout);
    if (resp.ok) {
      await fetchWorkoutTemplates();
      setInWorkoutTemplateCreationMode(false);
    }
  };

  // Handles section creation - currently a placeholder
  const handleSectionSave = async (section: Section) => {
    const resp = await CoachWorkoutService.createSectionTemplate(section);
    if( resp.ok ){
      await fetchSectionTemplates();
      setInSectionTemplateCreationMode(false);
    }
  }

  // Handler: delete a workout template by ID
  const handleWorkoutDeletion = async (workoutId: string) => {
    const resp = await CoachWorkoutService.deleteWorkoutTemplate(workoutId);
    if (resp.ok) {
      await fetchWorkoutTemplates();
      setInWorkoutTemplateCreationMode(false);
    }
  };

  // Handler: initialize creation of a new template
  const handleCreation = () => {
    if(selectedTab === 'workout'){
      setSelectedWorkout(undefined);
      setInWorkoutTemplateCreationMode(true);
    } else {
      setSelectedSection(undefined);
      setInSectionTemplateCreationMode(true);
    }
  };

  return (
    <div className="flex border-t trackme-border-gray h-[calc(100vh-64px)]">
      {/* Sidebar with list of workout templates */}
      <TemplatesSideBar
        workoutSummaries={workoutSummaries}
        sectionPreviews={sectionPreviews}
        selectedWorkout={selectedWorkout}
        handleWorkoutSelection={handleSelectWorkout}
        handleCreation={handleCreation}
        loading={loading}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />

      {/* Content area: either creation form or display + actions */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-4xl mx-auto">
          {inWorkoutTemplateCreationMode ? (
              // Creation / edit form
              <WorkoutCreation
                workout={selectedWorkout}
                handleWorkoutCreation={handleWorkoutSave}
                handleCancel={() => setInWorkoutTemplateCreationMode(false)}
              />
            ) : inSectionTemplateCreationMode ? (
              <SectionTemplateCreation
                sectionTemplate={selectedSection}
                handleSectionCreation={handleSectionSave}
                handleCancel={() => setInSectionTemplateCreationMode(false)}
              />
            )
            :selectedTab === 'workout' && selectedWorkout ? (
              // Display existing workout and action buttons
              <>
                <DisplayWorkout workout={selectedWorkout} />
                <div className="flex space-x-4 mt-6">
                  {selectedWorkout.workoutId && (
                    <TrackmeButton
                      red
                      className="w-full"
                      onClick={() => handleWorkoutDeletion(selectedWorkout.workoutId!)}
                    >
                      Delete Workout
                    </TrackmeButton>
                  )}
                  <TrackmeButton
                    onClick={() => setInWorkoutTemplateCreationMode(true)}
                    className="w-full"
                  >
                    Edit Workout
                  </TrackmeButton>
                </div>
              </>
            )
            : selectedSection && (
              <DisplaySection section={selectedSection}/>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default Templates;