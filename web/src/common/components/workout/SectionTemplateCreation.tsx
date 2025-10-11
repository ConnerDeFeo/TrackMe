import { useState } from "react";
import type { Section } from "../../types/workouts/Section";
import SectionCreation from "./SectionCreation";
import TrackmeButton from "../TrackmeButton";

const SectionTemplateCreation = ({sectionTemplate, handleSectionCreation, handleCancel}:
    {sectionTemplate?: Section, handleSectionCreation: (data:Section)=>void, handleCancel: ()=>void}
) => {
    const [sections, setSections] = useState<Section[]>(sectionTemplate ? [sectionTemplate] : [{name: '', minSets: 1, exercises: []}]);
    const section = sections[0];

    return(
        <>
            <SectionCreation
                section={section}
                setSections={setSections}
                idx={0}
                isTemplate
            />
            {/* Action Buttons */}
            <div className="flex gap-x-3">
                <TrackmeButton onClick={handleCancel} className="w-full" gray>
                    Cancel
                </TrackmeButton>
                <TrackmeButton
                    onClick={() =>handleSectionCreation(section)}
                    className="w-full"
                >
                    Save Section
                </TrackmeButton>
            </div>
        </>
    );
}

export default SectionTemplateCreation;