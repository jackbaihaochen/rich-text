/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import "./editorApp.css";
import "./setupEnv";
import * as React from "react";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { EditorState, TextNode } from "lexical";

import { SettingsContext } from "./context/SettingsContext";
import { SharedHistoryContext } from "./context/SharedHistoryContext";
import Editor from "./Editor";
import PlaygroundNodes from "./nodes/PlaygroundNodes";
import { TableContext } from "./plugins/TablePlugin";
import PlaygroundEditorTheme from "./themes/PlaygroundEditorTheme";
import parseContent from "./utils/parseContent";
import IGNOREITEMS from "./utils/ignoreItems";
import { ExtendedTextNode } from "./nodes/ExtendedTextNode";

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
  readonlyMode?: boolean;
  initialContent?: string;
  getContent?: (value: EditorState) => void;
}

export default function EditorApp({
  readonlyMode = false,
  initialContent,
  getContent,
  limitRows,
}: EditorAppProps): JSX.Element {
  if (initialContent) {
    // For compatibility. Parse the data from DB. Data can be old data as pure string or new data as EditorState formatted string.
    initialContent = parseContent(initialContent);
  }
  const initialConfig = {
    editable: !readonlyMode,
    // Initial editor state
    editorState: initialContent ?? undefined,
    namespace: "Playground",
    nodes: [
      ...PlaygroundNodes,
      ExtendedTextNode,
      {
        replace: TextNode,
        with: (node: TextNode) => new ExtendedTextNode(node.__text),
      },
    ],
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
            <div
              className={`editor-shell ${readonlyMode ? "editor-shell-readonly" : "editor-shell-editable"}`}
            >
              <Editor
                getContent={getContent}
                readonlyMode={readonlyMode}
                ignoreItems={[
                  IGNOREITEMS.numberList,
                  IGNOREITEMS.checkList,
                  IGNOREITEMS.quote,
                  IGNOREITEMS.codeBlock,
                  IGNOREITEMS.columnLayout,
                  IGNOREITEMS.equation,
                  IGNOREITEMS.Tweet,
                  IGNOREITEMS.Youtube動画,
                  IGNOREITEMS.Figma,
                ]}
                limitRows={limitRows}
              />
            </div>
          </TableContext>
        </SharedHistoryContext>
      </LexicalComposer>
    </SettingsContext>
  );
}
