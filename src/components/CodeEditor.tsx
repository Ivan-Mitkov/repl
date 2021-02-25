import React from "react";
import MonacoEditor, { EditorDidMount } from "@monaco-editor/react";

interface CodeEditorProps {
  initialValue: string;
  onChange(value: string): void;
}
const CodeEditor: React.FC<CodeEditorProps> = ({ initialValue, onChange }) => {
  /**
   * Signature: function(getEditorValue: func, editor: object) => void
   * This function will be called right after monaco editor will be mounted and ready to work.
   * It gets the editor instance as a second argument. Defaults to "noop"
   */
  const onEditorDidMount: EditorDidMount = (getValue, monacoEditor) => {
    /**
     * An event emitted when the content of the current model has changed.
     */
    monacoEditor.onDidChangeModelContent(() => {
      onChange(getValue());
    });
    //tab is 2 spaces
    monacoEditor.getModel()?.updateOptions({ tabSize: 2 });
  };
  return (
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
  );
};

export default CodeEditor;
