import React, { useRef, useState } from "react";
import DragAndDropSvgIcon from "./Icons/DragAndDropSvgIcon";
import { EXT_HEIGHT, EXT_PARENT_PADDING, EXT_WIDTH } from "@/constants/global";
import { localNotePosition } from "@/utils/storage.ts";
import MinSvgIcon from "./Icons/MinSvgIcon";

interface DraggableExtensionProps {
    children: React.ReactNode; // Allows passing any content inside the draggable container
}

const DraggableExtension: React.FC<DraggableExtensionProps> = ({ children }) => {
    const pluginRef = useRef<HTMLDivElement | null>(null); // Reference to the parent element
    const [isDragging, setIsDragging] = useState(false);
    const positionRef = useRef<{x: number, y: number}>({ x: 0, y: 0 }); // Tracks the current position
    const offsetRef = useRef<{x: number, y: number}>({ x: 0, y: 0 });  // Tracks the initial click offset
    const [isExistStartPosition, setIsExistStartPosition] = useState<boolean>(false);
    const [isMinimizedView, setIsMinimizedView] = useState<boolean>(true);

    useEffect(() => {
        async function readStoredPosition() {
            const storedStartPosition = await localNotePosition.getValue();
            const windowWidth = window.innerWidth;
            let xCoordinate = storedStartPosition ? storedStartPosition.x : (windowWidth - EXT_WIDTH - EXT_PARENT_PADDING);
            let yCoordinate = storedStartPosition ? storedStartPosition.y : EXT_PARENT_PADDING;

            positionRef.current = {
                x: xCoordinate,
                y: yCoordinate,
            }
            console.log(positionRef.current)
            setIsExistStartPosition(true);
        }

        readStoredPosition();
    }, [])

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

        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        let deltaX = e.clientX - offsetRef.current.x;
        const newLeft = Math.min(
            Math.max(deltaX, EXT_PARENT_PADDING),
            windowWidth - EXT_WIDTH - EXT_PARENT_PADDING
        );

        let deltaY = e.clientY - offsetRef.current.y;
        const newTop = Math.min(
            Math.max(deltaY, EXT_PARENT_PADDING),
            windowHeight - EXT_HEIGHT - EXT_PARENT_PADDING
        );

        // Update positionRef
        positionRef.current = { x: newLeft, y: newTop };

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

        console.log("offsetRef", offsetRef.current)
        void localNotePosition.setValue({ x: positionRef.current.x, y: positionRef.current.y});
    };

    if (!isExistStartPosition) {
        return null; // Or a loading spinner
    }

    return (
        <div
            id="pluginNotes"
            className={isMinimizedView ? "miminized" : ""}
            ref={pluginRef}
            style={{
                transform: `translate(${positionRef.current.x}px, ${positionRef.current.y}px)`,
            }}
        >
            {
                !isMinimizedView
                    ?   <>
                            <div
                                id="draggablePoint"
                                onMouseDown={startDragging}
                            >
                                <DragAndDropSvgIcon className="moveIcon icon without-margin"/>
                            </div>
                            <div
                                id="minimizationBtn"
                                onClick={e => setIsMinimizedView(true)}
                                title="minimization"
                            >
                                <MinSvgIcon className="moveIcon icon without-margin"/>
                            </div>
                            {children}
                        </>
                    :   <img src={chrome.runtime.getURL("icon/32.png")} alt="logo" id="minimizedLogo" onClick={e => setIsMinimizedView(false)}/>
            }

        </div>
    );
};

export default DraggableExtension;