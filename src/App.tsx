import { useEffect, useState } from "react";
import EditorApp from "./component/EditorComponent/EditorApp";
import { EditorState } from "lexical";
import { uploadAllImages } from "./component/EditorComponent/utils/uploadImage";
import { validateContent } from "./component/EditorComponent/utils/validateContent";

export default function App() {
  const [content, setContent] = useState<string>();
  const [init, setInit] = useState<string>();
  const [initLoading, setInitLoading] = useState<boolean>(true);
  const [refresh, setRefresh] = useState<number>(0);

  const getContent = (value: EditorState) => {
    setContent(JSON.stringify(value?.toJSON()));
  };

  const refreshDisplay = async () => {
    if (content) {
      const newContent = await uploadAllImages(
        content,
        "http://127.0.0.1:5000/upload"
      );
      console.log("newContent", JSON.parse(newContent));
      console.log("validate", validateContent(newContent));
      setContent(newContent);
    }

    setRefresh(refresh + 1);
  };

  const fakeInit = `{"root":{"children":[{"children":[{"detail":0,"format":1,"mode":"normal","style":"","text":"apple","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"tree","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}
  `;
  const fakeData = `改行のテストです。\nDBでどう表示するのを確認します。\n\n\nsd fasdfasdfあ`;

  const loadInit = async () => {
    setInit(fakeInit);
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
        // limitRows={5}
        readonlyMode={true}
        initialContent={content ? content : undefined}
        key={refresh}
      />
    </>
  );
}
