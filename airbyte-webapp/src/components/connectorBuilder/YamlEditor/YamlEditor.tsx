import { useMonaco } from "@monaco-editor/react";
import { load, YAMLException } from "js-yaml";
import debounce from "lodash/debounce";
import { editor } from "monaco-editor/esm/vs/editor/editor.api";
import React, { useMemo, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { useUpdateEffect } from "react-use";

import { CodeEditor } from "components/ui/CodeEditor";

import { ConnectorManifest } from "core/api/types/ConnectorManifest";
import { useConnectorBuilderFormState } from "services/connectorBuilder/ConnectorBuilderStateService";

import styles from "./YamlEditor.module.scss";
import { Sidebar } from "../Sidebar";
import { useBuilderWatch } from "../types";

export const YamlEditor: React.FC = () => {
  const yamlEditorRef = useRef<editor.IStandaloneCodeEditor>();
  const { setYamlEditorIsMounted, setYamlIsValid, updateJsonManifest } = useConnectorBuilderFormState();
  const { setValue } = useFormContext();
  const yamlValue = useBuilderWatch("yaml");

  // debounce the setJsonManifest calls so that it doesnt result in a network call for every keystroke
  const debouncedUpdateJsonManifest = useMemo(() => debounce(updateJsonManifest, 200), [updateJsonManifest]);

  const monaco = useMonaco();
  const monacoRef = useRef(monaco);
  monacoRef.current = monaco;

  useUpdateEffect(() => {
    if (monacoRef.current && yamlEditorRef.current && yamlValue) {
      const errOwner = "yaml";
      const yamlEditorModel = yamlEditorRef.current.getModel();

      try {
        const json = load(yamlValue) as ConnectorManifest;
        setYamlIsValid(true);
        debouncedUpdateJsonManifest(json);

        // clear editor error markers
        if (yamlEditorModel) {
          monacoRef.current.editor.setModelMarkers(yamlEditorModel, errOwner, []);
        }
      } catch (err) {
        if (err instanceof YAMLException) {
          setYamlIsValid(false);
          const mark = err.mark;

          // set editor error markers
          if (yamlEditorModel) {
            monacoRef.current.editor.setModelMarkers(yamlEditorModel, errOwner, [
              {
                startLineNumber: mark.line + 1,
                startColumn: mark.column + 1,
                endLineNumber: mark.line + 1,
                endColumn: mark.column + 2,
                message: err.message,
                severity: monacoRef.current.MarkerSeverity.Error,
              },
            ]);
          }
        }
      }
    }
  }, [yamlValue, debouncedUpdateJsonManifest, setYamlIsValid]);

  return (
    <div className={styles.container}>
      <Sidebar yamlSelected />
      <div className={styles.editorContainer}>
        <CodeEditor
          value={yamlValue}
          language="yaml"
          automaticLayout
          onChange={(value) => setValue("yaml", value ?? "")}
          lineNumberCharacterWidth={6}
          onMount={(editor) => {
            setYamlEditorIsMounted(true);
            yamlEditorRef.current = editor;
          }}
          paddingTop
        />
      </div>
    </div>
  );
};
