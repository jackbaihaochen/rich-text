import { useEffect, useState } from "react";
import EditorApp from "./component/EditorComponent/EditorApp";
import { EditorState } from "lexical";

export default function App() {
  const [content, setContent] = useState<string>();
  const [init, setInit] = useState<string>();
  const [initLoading, setInitLoading] = useState<boolean>(true);
  const [refresh, setRefresh] = useState<number>(0);

  const getContent = (value: EditorState) => {
    setContent(JSON.stringify(value?.toJSON()));
  };

  const refreshDisplay = () => {
    setRefresh(refresh + 1);
  };

  const fakeInit = `{"root":{"children":[{"children":[{"detail":0,"format":1,"mode":"normal","style":"","text":"apple","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"tree","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}
  `;
  const fakeData = `改行のテストです。\nDBでどう表示するのを確認します。\n\n\nsd fasdfasdfあ`;

  const parseContent = (data: string) => {
    try {
      JSON.parse(data);
      return data;
    } catch (e) {
      console.error(e);
      // parse fakeData into fakeInit format
      const lines = data.split("\n");
      let resultJson = {
        root: {
          children: lines.map((line) => {
            return {
              children: [
                {
                  detail: 0,
                  format: 0,
                  mode: "normal",
                  style: "",
                  text: line,
                  type: "text",
                  version: 1,
                },
              ],
              direction: "ltr",
              format: "",
              indent: 0,
              type: "paragraph",
              version: 1,
            };
          }),
          direction: "ltr",
          format: "",
          indent: 0,
          type: "root",
          version: 1,
        },
      };
      return JSON.stringify(resultJson);
    }
    return "";
  };
  const loadInit = async () => {
    const data = parseContent(fakeData);
    // wait for 0.5 sec
    // await new Promise((resolve) => setTimeout(resolve, 500));
    setInit(data);
    setInitLoading(false);
  };
  useEffect(() => {
    loadInit();
  }, []);

  return (
    <>
      {initLoading ? (
        <></>
      ) : (
        <EditorApp
          readonlyMode={false}
          getContent={getContent}
          initialContent={init}
        />
      )}
      <button onClick={refreshDisplay}>保存</button>
      <p>区切り線の下に保存された内容が表示されます</p>
      <hr />
      <EditorApp
        limitRows={5}
        readonlyMode={true}
        initialContent={content ? content : undefined}
        key={refresh}
      />
    </>
  );
}
