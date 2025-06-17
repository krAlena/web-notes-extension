import React from 'react'
// import { sendMessage } from 'webext-bridge/popup';
import { sendMessage } from "webext-bridge/popup";
import DraggableExtension from './DraggableExtensionLayout';
import useSpeechRecognition from "../utils/hooks/useSpeechRecognitionHook.ts";
import MicrophoneSvgIcon from './Icons/MicrophoneSvgIcon.tsx';

export default function  NoteLayout({}) {
    const [note, setNote] = useState<string>("");
    const [title, setTitle] = useState<string>("Your note");
    const [isSaved, setIsSaved] = useState<boolean>(false);
    const { text, finalText, startListening, stopListening, isListening, hasRecognitionSupport } = useSpeechRecognition();

    useEffect(() => {
        readNoteFromStorage();
    }, []);

    useEffect(() => {
        if (isSaved) return;
        localNoteContent.setValue({note, title});
    }, [note, title]);

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
        // if (!isSaved){
        setIsSaved(true);
        localNoteContent.setValue({note, title});
        // }
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

    const handleStartListening = () => {
        // Must be called directly from a user action
        startListening();
    };

    const handleStopListening = () => {
        stopListening();

        let newNoteContent = note + " " + text;
        setNote(newNoteContent);
        setIsSaved(false);
    };

    const handleRestartListening = () => {
        stopListening();
        startListening();
    };

    const handleCopyTranscript = async () => {
        try {
            await navigator.clipboard.writeText(finalText || text);
        } catch (err) {
            console.error('Failed to copy transcript:', err);
        }
    };

    return (
        <DraggableExtension>
            <div className="flex-row header">
                <input
                    className='input-title'
                    onBlur={e => setIsSaved(false)}
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
                    onBlur={e => setIsSaved(false)}
                    value={note}
                    onDragStart={event => event.preventDefault()}
                />
                <div className='flex-row footer'>
                    {/* <button onClick={authWithGoogle}>Auth with Google</button> */}
                    <MicrophoneSvgIcon
                        onClick={!isListening ? handleStartListening : handleStopListening}
                        className="icon stroke-color without-margin"
                    />
                </div>
            </div>
            </DraggableExtension>
    )
}