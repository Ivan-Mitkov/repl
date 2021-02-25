import React from "react";
import MonacoEditor, { EditorDidMount } from "@monaco-editor/react";
import prettier from "prettier";
import parser from "prettier/parser-babel";
interface CodeEditorProps {
  initialValue: string;
  onChange(value: string): void;
}
const CodeEditor: React.FC<CodeEditorProps> = ({ initialValue, onChange }) => {
  const editorRef = React.useRef<any>();
  /** Signature: function(getEditorValue: func, editor: object) => void
   * This function will be called right after monaco editor will be mounted and ready to work.
   * It gets the editor instance as a second argument. Defaults to "noop"
   */
  const onEditorDidMount: EditorDidMount = (getValue, monacoEditor) => {
    //get reference to the editor in order to use it in prettier format
    editorRef.current = monacoEditor;
    // An event emitted when the content of the current model has changed.
    monacoEditor.onDidChangeModelContent(() => {
      onChange(getValue());
    });
    //tab is 2 spaces
    monacoEditor.getModel()?.updateOptions({ tabSize: 2 });
  };

  const formatCode = () => {
    console.log(editorRef.current);
    //get current value from editor
    const unformatted = editorRef.current.getModel().getValue();
    //format value
    const formatted = prettier.format(unformatted, {
      parser: "babel",
      plugins: [parser],
      useTabs: false,
      semi: true,
      singleQuote: false,
    });
    //set formated value inside editor
    editorRef.current.setValue(formatted);
  };
  return (
    <div>
      <button onClick={formatCode}>Format</button>
      <MonacoEditor
        editorDidMount={onEditorDidMount}
        value={initialValue}
        height="500px"
        language="javascript"
        theme="dark"
        options={{
          wordWrap: "on",
          minimap: { enabled: false },
          showUnused: false,
          folding: false,
          lineNumbersMinChars: 3,
          fontSize: 16,
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      ></MonacoEditor>
    </div>
  );
};

export default CodeEditor;
