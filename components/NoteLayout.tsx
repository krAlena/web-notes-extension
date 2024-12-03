import React from 'react'

export default function  NoteLayout({}) {
    const [isExtensionDragging, setIsExtensionDragging] = useState<boolean>(false);
    const [note, setNote] = useState<string>("");
    const [title, setTitle] = useState<string>("Your note");
    const [isSaved, setIsSaved] = useState<boolean>(false);

    useEffect(() => {
        readNoteFromStorage();
    }, [])

    async function readNoteFromStorage() {
        let savedNote = await localNoteContent.getValue();

        if (!isEmptyObj(savedNote)){
            if (savedNote?.note){
                setNote(savedNote.note);
            }
            if(savedNote?.title){
                setTitle(savedNote.title);
            }
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
        if (!isSaved){
            setIsSaved(true);
            localNoteContent.setValue({note, title});
        }
    }

    const exportToGoogleKeep = () => {
        alert('exportToGoogleKeep')
    }

    const handleChangeNoteField = (fieldName: string, fieldValue: string) => {
        setIsSaved(false);

        switch (fieldName) {
            case "title":
                setTitle(fieldValue);
                break;
            case "note":
                setNote(fieldValue);
                break;
            default:
                break;
        }
    }

    return (
        <div>
            <div className={`flex-row header ${isExtensionDragging ? "moving" : ""}`}
                onMouseDown={startDraggingExtension}
                onMouseUp={stopDraggingExtension}
            >
                <input
                    className='input-title'
                    onBlur={saveNoteToLocalStore}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeNoteField('title', e.target.value)}
                    value={title}
                    onDragStart={event => event.preventDefault()}
                >
                </input>
            </div>
            <textarea className="note-content"
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChangeNoteField('note', e.target.value)}
                suppressContentEditableWarning
                onBlur={saveNoteToLocalStore}
                value={note}
                onDragStart={event => event.preventDefault()}
            />
            {/* <button onClick={exportToGoogleKeep}>Export to Google keep</button> */}
        </div>
    )
}