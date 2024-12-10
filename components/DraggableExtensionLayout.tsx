import React, { useRef, useState } from "react";

interface DraggableExtensionProps {
    children: React.ReactNode; // Allows passing any content inside the draggable container
}

const DraggableExtension: React.FC<DraggableExtensionProps> = ({ children }) => {
    const pluginRef = useRef<HTMLDivElement | null>(null); // Reference to the parent element
    const [isDragging, setIsDragging] = useState(false);
    const positionRef = useRef({ x: 0, y: 0 }); // Tracks the current position
    const offsetRef = useRef({ x: 0, y: 0 });  // Tracks the initial click offset

    const startDragging = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        setIsDragging(true);
        console.log('startDragging ')
        document.body.style.userSelect = "none";

        const parent = pluginRef.current;
        if (!parent) return;

        // Get the mouse position relative to the parent
        const rect = parent.getBoundingClientRect();
        offsetRef.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };

        // Add listeners to track movement
        document.addEventListener("mousemove", moveElement);
        document.addEventListener("mouseup", stopDragging);
    };

    const moveElement = (e: MouseEvent) => {
        // if (!isDragging) return;

        // Calculate the new position
        const newX = e.clientX - offsetRef.current.x;
        const newY = e.clientY - offsetRef.current.y;

        // Update positionRef
        positionRef.current = { x: newX, y: newY };

        // Update the position via transform
        const parent = pluginRef.current;
        if (parent) {
            parent.style.transform = `translate(${newX}px, ${newY}px)`;
        }
    };

    const stopDragging = () => {
        setIsDragging(false);
        document.body.style.userSelect = "auto";

        // Remove listeners
        document.removeEventListener("mousemove", moveElement);
        document.removeEventListener("mouseup", stopDragging);
    };

    return (
        <div
            id="pluginNotes"
            ref={pluginRef}
            style={{
                position: "fixed",
                transform: `translate(${positionRef.x}px, ${positionRef.y}px)`,

            }}
        >
            <div
                id="draggablePoint"
                onMouseDown={startDragging}
            >
                Drag me
            </div>
            {children}
        </div>
    );
};

export default DraggableExtension;