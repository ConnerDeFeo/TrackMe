/**
 * Starts a drag-and-drop operation on mouse down.
 * - Ignores clicks on form elements (INPUT, TEXTAREA, BUTTON).
 * - Records the index of the item being dragged and its initial position.
 * - Attaches global listeners to track mouse movement and end the drag.
 */
export const HandleMouseDownDragAndDrop = (
    e: React.MouseEvent,
    index: number,
    setDraggedItemIndex: React.Dispatch<React.SetStateAction<number | null>>,
    setDragPosition: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>
) => {
    // Skip dragging when interacting with form controls
    const tag = (e.target as HTMLElement).tagName;
    if (["INPUT", "TEXTAREA", "BUTTON"].includes(tag)) {
        return;
    }

    // Prevent default browser behavior (like text selection)
    e.preventDefault();

    // Mark the item as being dragged and store its start position
    setDraggedItemIndex(index);
    setDragPosition({
        x: e.clientX,
        y: e.clientY,
    });

    /**
     * Update the drag position as the mouse moves.
     * This will typically be used to reposition a ghost element or placeholder.
     */
    const handleMouseMove = (moveEvent: MouseEvent) => {
        setDragPosition({
            x: moveEvent.clientX,
            y: moveEvent.clientY,
        });
    };

    /**
     * Clean up when the mouse button is released:
     * - Clear the dragged item index.
     * - Remove both mousemove and mouseup listeners.
     */
    const handleMouseUp = () => {
        setDraggedItemIndex(null);
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
    };

    // Register global listeners to track the drag across the entire document
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
};