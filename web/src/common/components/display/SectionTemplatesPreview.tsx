const SectionTemplatesPreview = ({ sectionPreviews, selectedSection, handleSectionSelection }:
    {
      sectionPreviews: {id: string, name: string}[],
        selectedSection: any;
        handleSectionSelection: (sectionId: string) => void;
    }
) => {
    console.log("selectedSection", selectedSection);
    console.log(sectionPreviews);
  return (
    <>
      {sectionPreviews.map((preview) => {
        const isSelected = selectedSection?.id === preview.id;
        return (
          <button
            key={preview.id}
            onClick={() => handleSectionSelection(preview.id)}
            className={`w-full text-left p-4 rounded-lg transition-all ${
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