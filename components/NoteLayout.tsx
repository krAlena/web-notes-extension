import React from 'react'

export default function  NoteLayout({}) {
    const [isExtensionDragging, setIsExtensionDragging] = useState<boolean>(false);
    const [noteContent, setNoteContent] = useState<string>("");

    useEffect(() => {
        readNoteContentFromStorage();
    }, [])

    async function readNoteContentFromStorage() {
        let savedNote = await localNoteContent.getValue();

        if (savedNote && savedNote !== ""){
            setNoteContent(savedNote);
        }
    }

    const startDraggingExtension = () => {
      setIsExtensionDragging(true)
      document.body.style.userSelect = 'none';
    }

    const stopDraggingExtension = () => {
        setIsExtensionDragging(false)
        document.body.style.userSelect = 'auto';
    }

    const saveNoteToLocalStore = () => {
        localNoteContent.setValue(noteContent);
    }

    const exportToGoogleKeep = () => {
        alert('exportToGoogleKeep')
    }
    return (
        <div>
            <div className={`flex-row header ${isExtensionDragging ? "moving" : ""}`}
                onMouseDown={startDraggingExtension}
                onMouseUp={stopDraggingExtension}
            >
                Your note:
            </div>
            <textarea className="note-content"
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNoteContent(e.target.value)}
                suppressContentEditableWarning
                onBlur={saveNoteToLocalStore}
                value={noteContent}
            />
            {/* <button onClick={exportToGoogleKeep}>Export to Google keep</button> */}
        </div>
    )
}