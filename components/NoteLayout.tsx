import React from 'react'
import DraggableExtension from './DraggableExtensionLayout';
import useSpeechRecognition from "../utils/hooks/useSpeechRecognitionHook.ts";
import Microphone from './Microphone.tsx';
import ClearSvgIcon from './Icons/ClearSvgIcon.tsx';
import CopySvgIcon from './Icons/CopySvgIcon.tsx';

export default function  NoteLayout({}) {
    const [note, setNote] = useState<string>("");
    const [baseNote, setBaseNote] = useState<string>("");
    const [title, setTitle] = useState<string>("Your note");
    const [isSaved, setIsSaved] = useState<boolean>(false);
    const { text, finalText, startListening, stopListening, isListening, hasRecognitionSupport } = useSpeechRecognition();

    useEffect(() => {
        readNoteFromStorage();

        function handleStorageChange(changes, areaName) {

            if (areaName === "local" && changes['note-content'].newValue.note) {
                if (changes['note-content'].newValue.note != note){
                    setNote(changes['note-content'].newValue.note || "");
                }
            }
        }

        if (browser && browser.storage && browser.storage.onChanged) {
            browser.storage.onChanged.addListener(handleStorageChange);
        }
    }, []);

    useEffect(() => {
        // Handler for tab/window activation
        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                readNoteFromStorage();
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, []);

    useEffect(() => {
        // if (isSaved) return;
        // localNoteContent.setValue({note, title});
        saveNoteToLocalStore();
    }, [note, title]);

    useEffect(() => {
        // Only update note with interim speech text if listening and text is not empty
        if (isListening && finalText !== "") {
            // Show the note plus the current interim text (not yet committed)
            setNote(baseNote + " " + finalText);
        }
    }, [finalText, isListening]);

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
        console.log('saveNoteToLocalStore');
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
        setBaseNote(note);
        startListening();
    };

    const handleStopListening = () => {
        stopListening();

        // let newNoteContent = note + " " + text;
        // setNote(newNoteContent);
        setBaseNote("");
        setIsSaved(false);
    };

    const copyNoteToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(note);
        } catch (err) {
            console.error('Failed to copy transcript:', err);
        }
    };

    const clearNoteContent = () => {
        setNote("");
        setIsSaved(false);
    }

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
                <div className='flex-row center footer'>
                    <CopySvgIcon
                        className='icon stroke-color'
                        title='Copy'
                        onClick={copyNoteToClipboard}
                    />
                    <Microphone
                        isListening={isListening}
                        onStart={handleStartListening}
                        onStop={handleStopListening}
                    />
                    <ClearSvgIcon
                        className='icon stroke-color'
                        title='Clear note'
                        onClick={clearNoteContent}
                    />
                </div>
            </div>
            </DraggableExtension>
    )
}