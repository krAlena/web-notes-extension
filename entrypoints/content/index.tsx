import "./style.css";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { localNotePosition } from "@/utils/storage.ts";

const EXT_WIDTH = 200;
const EXT_HEIGHT = 300;

export default defineContentScript({
  matches: ["*://*/*"],
  cssInjectionMode: "ui",

  async main(ctx) {
    const storedStartPosition = await localNotePosition.getValue();

    const ui = await createShadowRootUi(ctx, {
      name: "wxt-react-example",
      position: "inline",
      anchor: "body",
      append: "first",
      onMount: (container) => {
        // Don't mount react app directly on <body>
        const wrapper = document.createElement("div");
        wrapper.id = "pluginNotes"

        let xCoordinate = storedStartPosition ? storedStartPosition.x + "px" : `calc( 100% - ${EXT_WIDTH}px - 20px)`;
        let yCoordinate = storedStartPosition ? storedStartPosition.y + "px" : `20px`;

        wrapper.style.cssText = `
            position: absolute;
            height: 270px;
            box-sizing: content-box;
            width: ${EXT_WIDTH}px;
            height: ${EXT_HEIGHT}px;
            position: absolute;
            right: auto;
            left: ${xCoordinate};
            top: ${yCoordinate};
            z-index: 1000;
            box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
            display: flex;
            justify-content: center;
          `;

         // Drag-and-drop logic
        let offsetX = 0, offsetY = 0;
        wrapper.addEventListener('mousedown', (e) => {
          offsetX = e.offsetX;
          offsetY = e.offsetY;
          document.addEventListener('mousemove', move);
          document.addEventListener('mouseup', stop);
        });

        const move = (e: MouseEvent) => {
          const windowWidth = window.innerWidth;
          const windowHeight = window.innerHeight;
          let parentPadding = 5;
          let deltaX = e.clientX - offsetX;
          const newLeft = Math.min(
            Math.max(deltaX, parentPadding),
            windowWidth - EXT_WIDTH - parentPadding
          );

          let deltaY = e.clientY - offsetY;
          const newTop = Math.min(
            Math.max(deltaY, parentPadding),
            windowHeight - EXT_HEIGHT - parentPadding
          );
          wrapper.style.left = `${newLeft}px`;
          wrapper.style.top = `${newTop}px`;

          void localNotePosition.setValue({ x: newLeft, y: newTop});
        };

        const stop = () => {
          document.removeEventListener('mousemove', move);
          document.removeEventListener('mouseup', stop);
        };

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
