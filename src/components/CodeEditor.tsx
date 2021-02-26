import React from "react";
import MonacoEditor, { EditorDidMount } from "@monaco-editor/react";
import prettier from "prettier";
import parser from "prettier/parser-babel";
import codeShift from "jscodeshift";
//create file types.d.ts for removing error with missing type defs
import Highlighter from "monaco-jsx-highlighter";
import "./code-editor.css";
import "./syntax.css";

interface CodeEditorProps {
  initialValue: string;
  onChange(value: string): void;
}
const CodeEditor: React.FC<CodeEditorProps> = ({ initialValue, onChange }) => {
  //create ref to store editor
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

    //highlighting js code in editor
    const highlighter = new Highlighter(
      //@ts-ignore
      window.monaco,
      codeShift,
      monacoEditor
    );

    /**
     * https://www.npmjs.com/package/monaco-jsx-highlighter
     *  Activate highlighting (debounceTime default: 100ms)
     * monacoJSXHighlighter.highLightOnDidChangeModelContent(100);
     *  Activate JSX commenting
     * monacoJSXHighlighter.addJSXCommentCommand();
     *  Done =)
     */
    highlighter.highLightOnDidChangeModelContent(
      //not logging errors on typing
      () => {},
      () => {},
      undefined,
      () => {}
    );
    highlighter.addJSXCommentCommand();
  };

  const formatCode = () => {
    //get current value from editor
    const unformatted = editorRef.current.getModel().getValue();
    //format value
    const formatted = prettier
      .format(unformatted, {
        parser: "babel",
        plugins: [parser],
        useTabs: false,
        semi: true,
        singleQuote: false,
      }) //remove new line character added by prettier
      .replace(/\n$/, "");
    //set formated value inside editor
    editorRef.current.setValue(formatted);
  };
  return (
    <div className="editor-wrapper">
      <button
        className="button button-format is-primary is-small"
        onClick={formatCode}
      >
        Format
      </button>
      <MonacoEditor
        editorDidMount={onEditorDidMount}
        value={initialValue}
        height="100%"
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
