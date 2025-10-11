import { useCallback, useEffect, useState } from "react";
import CoachWorkoutService from "../services/CoachWorkoutService";
import DisplayWorkout from "../common/components/display/workout/DisplayWorkout";
import TrackmeButton from "../common/components/TrackmeButton";
import WorkoutCreation from "../common/components/workout/WorkoutCreation";
import type { Workout } from "../common/types/workouts/Workout";
import type { WorkoutSummary } from "../common/types/workouts/WorkoutSummary";
import TemplatesSideBar from "../common/components/display/TemplatesSideBar";
import type { Section } from "../common/types/workouts/Section";
import SectionTemplateCreation from "../common/components/workout/SectionTemplateCreation";
import DisplaySection from "../common/components/display/workout/DisplaySection";
import type { SectionSummary } from "../common/types/workouts/SectionSummary";

// Templates page: manage workout and section templates
const Templates = () => {
  // State: list of workout templates fetched from server
  const [workoutSummaries, setWorkoutSummaries] = useState<WorkoutSummary[]>([]);
  // State: preview data for section templates
  const [sectionPreviews, setSectionPreviews] = useState<SectionSummary[]>([]);
  // State: the currently selected workout template (detailed)
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | undefined>(undefined);
  // State: the currently selected section template (detailed)
  const [selectedSection, setSelectedSection] = useState<Section | undefined>(undefined);
  // State: loading indicator for data fetches
  const [loading, setLoading] = useState(true);
  // State: toggles "create new workout template" mode
  const [inWorkoutTemplateCreationMode, setInWorkoutTemplateCreationMode] = useState(false);
  // State: toggles "create new section template" mode
  const [inSectionTemplateCreationMode, setInSectionTemplateCreationMode] = useState(false);
  // State: which tab is active in the sidebar ("workout" or "section")
  const [selectedTab, setSelectedTab] = useState<'workout' | 'section'>('workout');

  // Fetch full workout template by ID
  const fetchWorkout = useCallback(async (workoutId: string) => {
    const resp = await CoachWorkoutService.getWorkout(workoutId);
    if (resp.ok) {
      const data = await resp.json();
      setSelectedWorkout(data);
    } else {
      setSelectedWorkout(undefined);
    }
  }, []);

  // Fetch full section template by ID
  const fetchSection = useCallback(async (sectionId: string) => {
    const resp = await CoachWorkoutService.getSectionTemplate(sectionId);
    if (resp.ok) {
      const data = await resp.json();
      setSelectedSection(data);
    } else {
      setSelectedSection(undefined);
    }
  }, []);

  // Load list of workout templates and auto-select the first one
  const fetchWorkoutTemplates = async () => {
    setLoading(true);
    const response = await CoachWorkoutService.getWorkoutTemplates();
    if (response.ok) {
      const data = await response.json();
      setWorkoutSummaries(data);
      if (data.length > 0) {
        fetchWorkout(data[0].workoutId);
      }
    } else {
      setWorkoutSummaries([]);
      setSelectedWorkout(undefined);
    }
    setLoading(false);
  };

  // Load list of section template previews and auto-select first
  const fetchSectionTemplates = async () => {
    setLoading(true);
    const resp = await CoachWorkoutService.previewSectionTemplates();
    if (resp.ok) {
      const data = await resp.json();
      setSectionPreviews(data);
      if (data.length > 0) {
        fetchSection(data[0].id);
      }
    } else {
      setSectionPreviews([]);
      setSelectedSection(undefined);
    }
    setLoading(false);
  };

  // Effect: re-fetch items when active tab changes
  useEffect(() => {
      fetchWorkoutTemplates();
      fetchSectionTemplates();
  }, []);

  // Handler: user selects a workout from sidebar
  const handleSelectWorkout = useCallback(
    async (workoutId: string) => {
      await fetchWorkout(workoutId);
      setInWorkoutTemplateCreationMode(false);
    },
    [fetchWorkout]
  );

  // Handler: user selects a section from sidebar
  const handleSelectSection = useCallback(
    async (sectionId: string) => {
      await fetchSection(sectionId);
      setInSectionTemplateCreationMode(false);
    },
    [fetchSection]
  );

  // Handler: create or update a workout template
  const handleWorkoutSave = async (workout: Workout) => {
    const resp = await CoachWorkoutService.createWorkoutTemplate(workout);
    if (resp.ok) {
      await fetchWorkoutTemplates();
      setInWorkoutTemplateCreationMode(false);
    }
  };

  // Handler: create or update a section template
  const handleSectionSave = async (section: Section) => {
    const resp = await CoachWorkoutService.createSectionTemplate(section);
    if (resp.ok) {
      await fetchSectionTemplates();
      setInSectionTemplateCreationMode(false);
    }
  };

  // Handler: delete a workout template
  const handleWorkoutDeletion = async (workoutId: string) => {
    const resp = await CoachWorkoutService.deleteWorkoutTemplate(workoutId);
    if (resp.ok) {
      await fetchWorkoutTemplates();
      setInWorkoutTemplateCreationMode(false);
    }
  };

  // Handler: delete a section template
  const handleSectionDeletion = async (sectionId: string) => {
    const resp = await CoachWorkoutService.deleteSectionTemplate(sectionId);
    if (resp.ok) {
      await fetchSectionTemplates();
      setInSectionTemplateCreationMode(false);
    }
  };

  // Handler: begin creation of new template based on active tab
  const handleCreation = (tab: 'workout' | 'section') => {
    if (tab === 'workout') {
      setSelectedWorkout(undefined);
      setInWorkoutTemplateCreationMode(true);
    } else {
      setSelectedSection(undefined);
      setInSectionTemplateCreationMode(true);
    }
  };

  // Handler: switch between workout and section tabs
  const handleTabChange = (tab: 'workout' | 'section') => {
    setSelectedTab(tab);
  };

  return (
    <div className="flex border-t trackme-border-gray h-[calc(100vh-64px)]">
      {/* Sidebar: list of templates and controls */}
      <TemplatesSideBar
        workoutSummaries={workoutSummaries}
        sectionPreviews={sectionPreviews}
        selectedWorkoutId={selectedWorkout?.workoutId}
        selectedSectionId={selectedSection?.id}
        onWorkoutSelect={handleSelectWorkout}
        onSectionSelect={handleSelectSection}
        onCreateNew={handleCreation}
        onTabChange={handleTabChange}
        loading={loading}
      />

      {/* Main content area */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-4xl mx-auto">
          {selectedTab === 'workout' ? (
            // Workout Tab Content
            inWorkoutTemplateCreationMode ? (
              // Show workout creation form
              <WorkoutCreation
                workout={selectedWorkout}
                handleWorkoutCreation={handleWorkoutSave}
                handleCancel={() => setInWorkoutTemplateCreationMode(false)}
                sectionsPreviews={sectionPreviews}
              />
            ) : selectedWorkout && (
              // Display selected workout details
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
                    className="w-full"
                    onClick={() => setInWorkoutTemplateCreationMode(true)}
                  >
                    Edit Workout
                  </TrackmeButton>
                </div>
              </>
            )
          ) : (
            // Section Tab Content
            inSectionTemplateCreationMode ? (
              // Show section creation form
              <SectionTemplateCreation
                sectionTemplate={selectedSection}
                handleSectionCreation={handleSectionSave}
                handleCancel={() => setInSectionTemplateCreationMode(false)}
              />
            ) : selectedSection && (
              // Display selected section details
              <>
                <DisplaySection section={selectedSection} />
                <div className="flex space-x-4 mt-6">
                  {selectedSection.id && (
                    <TrackmeButton
                      red
                      className="w-full"
                      onClick={() => handleSectionDeletion(selectedSection.id!)}
                    >
                      Delete Section
                    </TrackmeButton>
                  )}
                  <TrackmeButton
                    className="w-full"
                    onClick={() => setInSectionTemplateCreationMode(true)}
                  >
                    Edit Section
                  </TrackmeButton>
                </div>
              </>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Templates;