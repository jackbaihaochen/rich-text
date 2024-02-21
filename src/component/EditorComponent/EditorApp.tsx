/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import "./editorApp.css";
import "./setupEnv";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { EditorState } from "lexical";

import { SettingsContext } from "./context/SettingsContext";
import { SharedAutocompleteContext } from "./context/SharedAutocompleteContext";
import { SharedHistoryContext } from "./context/SharedHistoryContext";
import Editor from "./Editor";
import PlaygroundNodes from "./nodes/PlaygroundNodes";
import { TableContext } from "./plugins/TablePlugin";
import PlaygroundEditorTheme from "./themes/PlaygroundEditorTheme";

// Handle runtime errors
const showErrorOverlay = (err: Event) => {
  const ErrorOverlay = customElements.get("vite-error-overlay");
  if (!ErrorOverlay) {
    return;
  }
  const overlay = new ErrorOverlay(err);
  const body = document.body;
  if (body !== null) {
    body.appendChild(overlay);
  }
};

window.addEventListener("error", showErrorOverlay);
window.addEventListener("unhandledrejection", ({ reason }) =>
  showErrorOverlay(reason)
);

interface EditorAppProps {
  limitRows?: number;
  readonlyMode: boolean;
  initialContent?: string;
  getContent?: (value: EditorState) => void;
}

export default function EditorApp({
  readonlyMode = false,
  initialContent,
  getContent,
  limitRows,
}: EditorAppProps): JSX.Element {
  if (readonlyMode) {
    console.log("initialContent", initialContent);
  }
  const initialConfig = {
    editable: !readonlyMode,
    // Initial editor state
    editorState: initialContent ?? undefined,
    namespace: "Playground",
    nodes: [...PlaygroundNodes],
    onError: (error: Error) => {
      throw error;
    },
    theme: PlaygroundEditorTheme,
  };
  return (
    <SettingsContext>
      <LexicalComposer initialConfig={initialConfig}>
        <SharedHistoryContext>
          <TableContext>
            <SharedAutocompleteContext>
              <div
                className={`${readonlyMode ? "" : "editor-shell"} ${limitRows ? "editor-limit-rows" : ""}`}
                style={limitRows ? { WebkitLineClamp: limitRows } : undefined}
              >
                <Editor getContent={getContent} readonlyMode={readonlyMode} />
              </div>
            </SharedAutocompleteContext>
          </TableContext>
        </SharedHistoryContext>
      </LexicalComposer>
    </SettingsContext>
  );
}
