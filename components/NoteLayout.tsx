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

    async function authWithGoogle() {
        try {
            const res = await sendMessage(
              "startGoogleAuthFlow",
              { key: 'value'},
              "background"
            );
            console.log('Response from background:', res);
            let token = res?.receivedData || "";
            createGKeepNote(token);
        } catch (error) {

            console.error('Error sending message:', error);
            try {
                const cachedResponse = await sendMessage(
                    'fetch-response-cache',
                    { key: 'value'},
                    "background");
                if (cachedResponse) {
                    console.log('Fetched cached response:', cachedResponse);
                } else {
                    console.log('No cached response found.');
                }
            } catch (retryError) {
                console.error('Error fetching cached response:', retryError);
            }
        }
    };

    const createGKeepNote = (token: string) => {
        console.log('createGKeepNote token:', token)
        let data = {};
        data.title = title;
        data.textContent = { text: note}
        // "title": "My New Note",
        // "textContent": {
        //   "text": "This is the content of the note."
        // },

        saveGoogleKeepNote(data, token);

        // {
        //     "name": string,
        //     "createTime": string,
        //     "updateTime": string,
        //     "trashTime": string,
        //     "trashed": boolean,
        //     "attachments": [
        //       {
        //         object (Attachment)
        //       }
        //     ],
        //     "permissions": [
        //       {
        //         object (Permission)
        //       }
        //     ],
        //     "title": string,
        //     "body": {
        //       object (Section)
        //     }
        //   }
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
                    <button onClick={authWithGoogle}>Auth with Google</button>
                </div>
            </div>
            </DraggableExtension>
    )
}