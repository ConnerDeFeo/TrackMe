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
  const [selectedTab, setSelectedTab] = useState<TemplateTab>('workout');

  const handleTabChange = (tab: TemplateTab) => {
    setSelectedTab(tab);
    onTabChange(tab);
  };

  const handleCreateClick = () => {
    onCreateNew(selectedTab);
  };

  const isWorkoutTab = selectedTab === 'workout';
  const currentList = isWorkoutTab ? workoutSummaries : sectionPreviews;
  const isEmpty = currentList.length === 0;

  return (
    <div className="w-80 bg-white border-r trackme-border-gray flex flex-col h-full">
      {/* Header */}
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

      {/* Template List / Loading / Empty */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          // Loading spinner
          <div className="p-6 text-center text-gray-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 trackme-border-blue mx-auto" />
            <p className="mt-2 text-sm">Loading {selectedTab}s...</p>
          </div>
        ) : isEmpty ? (
          // Empty state
          <div className="p-6 text-center text-gray-500">
            <p className="text-sm">No {selectedTab} templates yet</p>
          </div>
        ) : (
          // Template list
          <div className="p-3 space-y-2">
            {isWorkoutTab ? (
              <WorkoutTemplatesPreview
                workoutSummaries={workoutSummaries}
                selectedWorkout={{ workoutId: selectedWorkoutId }}
                handleWorkoutSelection={onWorkoutSelect}
              />
            ) : (
              <SectionTemplatesPreview
                sectionPreviews={sectionPreviews}
                selectedSection={{ id: selectedSectionId }}
                handleSectionSelection={onSectionSelect}
              />
            )}
          </div>
        )}
      </div>

      {/* Create Button */}
      <TrackmeButton className="m-6" onClick={handleCreateClick}>
        Create New Template
      </TrackmeButton>
    </div>
  );
};

export default TemplatesSideBar;