export function validateContent(editorStateContent?: string) {
  try {
    if (!editorStateContent) {
      return false;
    }
    // Check if the content is a valid JSON object
    const parsedContent = JSON.parse(editorStateContent);
    if (
      parsedContent.root &&
      parsedContent.root.children &&
      parsedContent.root.children.length > 0 &&
      parsedContent.root.children[0].children &&
      parsedContent.root.children[0].children.length > 0
    ) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
}
