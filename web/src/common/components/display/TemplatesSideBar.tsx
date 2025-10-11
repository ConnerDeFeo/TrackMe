import { useState } from "react";
import type { WorkoutSummary } from "../../types/workouts/WorkoutSummary";
import TrackmeButton from "../TrackmeButton";
import SectionTemplatesPreview from "./SectionTemplatesPreview";
import WorkoutTemplatesPreview from "./WorkoutTemplatesPreview";

type TemplateTab = 'workout' | 'section';

interface TemplatesSideBarProps {
  workoutSummaries: WorkoutSummary[];
  sectionPreviews: { id: string; name: string }[];
  selectedWorkoutId?: string;
  selectedSectionId?: string;
  onWorkoutSelect: (workoutId: string) => void;
  onSectionSelect: (sectionId: string) => void;
  onCreateNew: (tab: TemplateTab) => void;
  onTabChange: (tab: TemplateTab) => void;
  loading: boolean;
}

// TemplatesSideBar component renders a sidebar to browse and create workout or section templates
const TemplatesSideBar = ({
  workoutSummaries,
  sectionPreviews,
  selectedWorkoutId,
  selectedSectionId,
  onWorkoutSelect,
  onSectionSelect,
  onCreateNew,
  onTabChange,
  loading,
}: TemplatesSideBarProps) => {
  // Tracks which tab is currently active: 'workout' or 'section'
  const [selectedTab, setSelectedTab] = useState<TemplateTab>('workout');

  // Switch between tabs and notify parent
  const handleTabChange = (tab: TemplateTab) => {
    setSelectedTab(tab);
    onTabChange(tab);
  };

  // Trigger creation of a new template in the current tab
  const handleCreateClick = () => {
    onCreateNew(selectedTab);
  };

  // Determine which list to show based on active tab
  const isWorkoutTab = selectedTab === 'workout';
  const currentList = isWorkoutTab ? workoutSummaries : sectionPreviews;
  const isEmpty = currentList.length === 0;

  return (
    <div className="w-80 bg-white border-r trackme-border-gray flex flex-col h-full">
      {/* Header with title and tab buttons */}
      <div className="p-4 border-b trackme-border-gray flex-shrink-0">
        <h1 className="text-2xl font-bold text-gray-900">Templates</h1>
        <div className="flex justify-between text-md mt-4 text-gray-600 w-[80%] mx-auto font-bold">
          <button
            onClick={() => handleTabChange('workout')}
            className={`${
              selectedTab === 'workout' ? 'border-b-2 trackme-border-blue' : ''
            }`}
          >
            Workout
          </button>
          <button
            onClick={() => handleTabChange('section')}
            className={`${
              selectedTab === 'section' ? 'border-b-2 trackme-border-blue' : ''
            }`}
          >
            Section
          </button>
        </div>
      </div>

      {/* Main content area: handles loading, empty state, or list */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          // Loading indicator while data is being fetched
          <div className="p-6 text-center text-gray-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 trackme-border-blue mx-auto" />
            <p className="mt-2 text-sm">Loading {selectedTab}s...</p>
          </div>
        ) : isEmpty ? (
          // Display when there are no templates in the selected tab
          <div className="p-6 text-center text-gray-500">
            <p className="text-sm">No {selectedTab} templates yet</p>
          </div>
        ) : (
          // Render the list of templates for the active tab
          <div className="p-3 space-y-2">
            {isWorkoutTab ? (
              // Workout templates preview component
              <WorkoutTemplatesPreview
                workoutSummaries={workoutSummaries}
                selectedWorkoutId={selectedWorkoutId}
                handleWorkoutSelection={onWorkoutSelect}
              />
            ) : (
              // Section templates preview component
              <SectionTemplatesPreview
                sectionPreviews={sectionPreviews}
                selectedSectionId={selectedSectionId}
                handleSectionSelection={onSectionSelect}
              />
            )}
          </div>
        )}
      </div>

      {/* Button to create a new template in the current tab */}
      <TrackmeButton className="m-6" onClick={handleCreateClick}>
        Create New Template
      </TrackmeButton>
    </div>
  );
};

export default TemplatesSideBar;