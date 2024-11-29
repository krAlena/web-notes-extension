import { useState } from "react";

export default () => {
  // const [count, setCount] = useState(1);
  // const increment = () => setCount((count) => count + 1);

  return (
    <div>
      <h3>Your note:</h3>
      {/* <button onClick={increment}>Increment</button> */}
      <div className="note-content" contentEditable></div>
    </div>
  );
};
