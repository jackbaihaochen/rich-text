// Parse the data from DB. Data can be old data as pure string or new data as EditorState formatted string.
export default function parseContent(data: string) {
  try {
    JSON.parse(data);
    return data;
  } catch (e) {
    console.error(e);
    // parse fakeData into fakeInit format
    const lines = data.split("\n");
    const resultJson = {
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
}
