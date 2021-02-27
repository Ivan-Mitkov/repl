import React from "react";
import MDEditor from "@uiw/react-md-editor";
import "./text-editor.css";

//https://uiwjs.github.io/react-md-editor/
const TextEditor: React.FC = () => {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [editing, setEditing] = React.useState(false);
  const [value, setValue] = React.useState("# Edit");

  const showEditor = () => {
    setEditing(!editing);
  };
  const handleChange = (e: string) => {
    setValue(e);
  };
  React.useEffect(() => {
    const listener = (event: MouseEvent) => {
      //if clicked in editor return
      if (
        ref.current &&
        event.target &&
        //event.target can be Node or null
        ref.current.contains(event.target as Node)
      ) {
        return;
      }
      //else hide editor
      setEditing(false);
    };
    document.addEventListener("click", listener, { capture: true });
    return () => {
      document.removeEventListener("click", listener, { capture: true });
    };
  }, []);

  if (editing) {
    return (
      <div ref={ref} className="text-editor">
        <MDEditor value={value} onChange={(v) => handleChange(v || "")} />
      </div>
    );
  }

  return (
    <div onClick={showEditor} className="text-editor card">
      <div className="card-content">
        <MDEditor.Markdown source={value} />
      </div>
    </div>
  );
};

export default TextEditor;
