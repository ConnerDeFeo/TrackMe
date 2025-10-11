// Basic display component for showing time and distance information
const TimeDistanceDisplay = ({ time, distance, selected }: { time: number; distance: number; selected?: boolean }) => {
  return (
    <div className={`flex flex-row justify-between items-center bg-gray-100 p-2 rounded-md mb-1 border-2 ${selected ? "border-red-500" : "border-transparent"}`}>
      <p className="text-gray-700">Distance: {distance}m</p>
      <p className="text-gray-700">Time: {time}s</p>
    </div>
  );
};

export default TimeDistanceDisplay;