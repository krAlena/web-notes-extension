import React from 'react'

export default function  NoteLayout({}) {
    const [isExtensionDragging, setIsExtensionDragging] = useState(false);

    const startDraggingExtension = () => {
      setIsExtensionDragging(true)
      document.body.style.userSelect = 'none';
    }

    const stopDraggingExtension = () => {
        setIsExtensionDragging(false)
        document.body.style.userSelect = 'auto';
    }

    return (
        <div>
            <div className={`flex-row header ${isExtensionDragging ? "moving" : ""}`}
                onMouseDown={startDraggingExtension}
                onMouseUp={stopDraggingExtension}
            >
                Your note:
            </div>
            <div className="note-content" contentEditable></div>
        </div>
    )
}