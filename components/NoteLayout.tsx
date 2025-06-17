import React from 'react'
// import { sendMessage } from 'webext-bridge/popup';
import { sendMessage } from "webext-bridge/popup";
import DraggableExtension from './DraggableExtensionLayout';

export default function  NoteLayout({}) {
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

    const saveNoteToLocalStore = () => {
        if (!isSaved){
            setIsSaved(true);
            localNoteContent.setValue({note, title});
        }
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
        <DraggableExtension>
            <div className="flex-row header">
                <input
                    className='input-title'
                    onBlur={saveNoteToLocalStore}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeNoteField('title', e.target.value)}
                    value={title}
                    onDragStart={event => event.preventDefault()}
                >
                </input>
            </div>
            <div className='flex-col main-content'>
                <textarea className="note-content"
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChangeNoteField('note', e.target.value)}
                    suppressContentEditableWarning
                    onBlur={saveNoteToLocalStore}
                    value={note}
                    onDragStart={event => event.preventDefault()}
                />
                <div className='flex-row footer'>
                    {/* <button onClick={authWithGoogle}>Auth with Google</button> */}
                </div>
            </div>
            </DraggableExtension>
    )
}