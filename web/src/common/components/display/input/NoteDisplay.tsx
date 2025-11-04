const NoteDisplay = ({ note, selected }: { note: string; selected?: boolean }) => {
  return <div className={`${selected ? "bg-yellow-100" : ""} p-4 rounded`}>{note}</div>;
};

export default NoteDisplay;