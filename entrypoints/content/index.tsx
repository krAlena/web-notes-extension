import "./style.css";
import "../../styles/default.sass";
import "../../styles/mainLayout.sass";
import { localNoteContent } from '../../public/utils/storage';

import ReactDOM from "react-dom/client";
import App from "./App.tsx";

browser.runtime.onMessage.addListener((event) => {
    if (event.action === "copyToNote") {
        // dynamic mount by user action via messaging.
        localNoteContent.getValue().then(res => {
          console.log('currentNote', res)
          const prevNote = res.note || '';
          let newNote = (prevNote == '') ? event.info.selectionText : prevNote +  '\n'  + event.info.selectionText;

          localNoteContent.setValue({note: newNote , title: res.title});
        })
    }
});

export default defineContentScript({
  matches: ["*://*/*"],
  cssInjectionMode: "ui",

  async main(ctx) {

    const ui = await createShadowRootUi(ctx, {
      name: "wxt-react-example",
      position: "inline",
      anchor: "body",
      append: "first",
      onMount: (container) => {
        // Don't mount react app directly on <body>
        const wrapper = document.createElement("div");
        wrapper.id = "pluginNotesWrapper"
        wrapper.style.cssText = `
            position: absolute;
            box-sizing: content-box;
            z-index: 9999;
            display: flex;
          `;

        container.append(wrapper);

        const root = ReactDOM.createRoot(wrapper);
        root.render(<App />);
        return { root, wrapper };
      },
      onRemove: (elements) => {
        elements?.root.unmount();
        elements?.wrapper.remove();
      },
    });

    ui.mount();
  },
});
