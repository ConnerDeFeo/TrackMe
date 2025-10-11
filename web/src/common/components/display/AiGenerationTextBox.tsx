const AiGenerationTextBox = ({ aiWorkoutPrompt, setAiWorkoutPrompt, handleAiWorkoutGeneration }: 
    { aiWorkoutPrompt: string; setAiWorkoutPrompt: (value: string) => void; handleAiWorkoutGeneration: () => void }) => {
  return (
    <div className="relative my-4">
        <textarea
            value={aiWorkoutPrompt}
            onChange={e => {
                setAiWorkoutPrompt(e.target.value)
                // Auto-resize but cap at 200px height
                e.target.style.height = "auto"
                e.target.style.height = `${Math.min(
                    e.target.scrollHeight,
                    200
                )}px`
            }}
            placeholder="AI Workout Generation prompt..."
            className="w-full p-4 pr-12 border trackme-border-gray rounded resize-none
                                    overflow-y-auto max-h-[200px] break-words"
            onKeyDown={e => {
                if (e.key === "Enter") handleAiWorkoutGeneration()
            }}
        />

        {/* Trigger icon for AI request */}
        <div className="absolute right-4 bottom-6">
            {aiWorkoutPrompt === "" ? (
                <img
                    src="/assets/images/Sparkle.png"
                    alt="Enter prompt to generate"
                    className="h-10 w-10"
                />
            ) : (
                <img
                    src="/assets/images/ArrowUp.png"
                    alt="Generate AI workout"
                    className="h-10 w-10 cursor-pointer"
                    onClick={handleAiWorkoutGeneration}
                />
            )}
        </div>
    </div>
  );
}
export default AiGenerationTextBox;