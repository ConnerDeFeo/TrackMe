const SectionTemplatesPreview = ({ sectionPreviews, selectedSectionId, handleSectionSelection }:
    {
        sectionPreviews: {id: string, name: string}[],
        selectedSectionId?: string;
        handleSectionSelection: (sectionId: string) => void;
    }
) => {
  return (
    <>
      {sectionPreviews.map((preview) => {
        const isSelected = selectedSectionId === preview.id;
        return (
          <button
            key={preview.id}
            onClick={() => handleSectionSelection(preview.id)}
            className={`w-full text-left p-4 rounded-lg transition-all border-b ${
              isSelected
                ? "trackme-bg-blue text-white shadow-md"
                : "bg-gray-50 text-gray-900 hover:bg-gray-100"
            }`}
          >
            {/* Name */}
            <h3
              className={`font-semibold text-sm ${
                isSelected
                  ? "text-white"
                  : "text-gray-900"
              }`}
            >
              {preview.name}
            </h3>
          </button>
        );
      })}
    </>
  );
}

export default SectionTemplatesPreview;