import type { WorkoutSummary } from "../../types/workouts/WorkoutSummary";
import TrackmeButton from "../TrackmeButton";
import WorkoutTemplatesPreview from "./WorkoutTemplatesPreview";

const TemplatesSideBar = ({ workoutSummaries, sectionPreviews, selectedWorkout, handleWorkoutSelection, loading, handleCreateNewWorkout, selectedTab, setSelectedTab}:
    {
      workoutSummaries: WorkoutSummary[], 
      sectionPreviews: {id: string, name: string}[],
      selectedWorkout: any, 
      handleWorkoutSelection: (workoutId:string) => void, 
      loading: boolean, 
      handleCreateNewWorkout: () => void,
      selectedTab: 'workout' | 'section',
      setSelectedTab: (tab: 'workout' | 'section') => void
    }
) => {
  return (
    <div className="w-80 bg-white border-r trackme-border-gray flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b trackme-border-gray flex-shrink-0">
          <h1 className="text-2xl font-bold text-gray-900">
           Templates
          </h1>
          <div className="flex justify-between text-md mt-4 text-gray-600 w-[80%] mx-auto font-bold">
            <button onClick={()=>setSelectedTab('workout')} className={`${selectedTab === 'workout' ? 'border-b-2 trackme-border-blue' : ''}`}>
              Workout
            </button>
            <button onClick={()=>setSelectedTab('section')} className={`${selectedTab === 'section' ? 'border-b-2 trackme-border-blue' : ''}`}>
              Section
            </button>
          </div>
        </div>

        {/* Template List / Loading / Empty */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
              // Loading spinner in sidebar
              <div className="p-6 text-center text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 trackme-border-blue mx-auto" />
                <p className="mt-2 text-sm">Loading workouts...</p>
              </div>
            ) : workoutSummaries.length === 0 ? (
              // No templates placeholder
              <div className="p-6 text-center text-gray-500">
                <p className="text-sm">No workout templates yet</p>
              </div>
            ) : (
              // Map over templates
              <div className="p-3 space-y-2">
                <WorkoutTemplatesPreview
                  workoutSummaries={workoutSummaries}
                  selectedWorkout={selectedWorkout}
                  handleWorkoutSelection={handleWorkoutSelection}
                />
              </div>
          )}
        </div>
        <TrackmeButton className="m-6" onClick={handleCreateNewWorkout}>
          Create New Template
        </TrackmeButton>
      </div>
  );
}

export default TemplatesSideBar;