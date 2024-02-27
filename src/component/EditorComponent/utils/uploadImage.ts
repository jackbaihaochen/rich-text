import { v4 as uuidv4 } from "uuid";
// base64String be like: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/4QA6RXhpZgAATU0AKgAAAAgAA1IBAAABAAEAAAgAA1"
function base64ToBlob(base64String: string) {
  const block = base64String.split(";");
  // Get the content type of the image: image/jpeg, image/png, etc
  const contentType = block[0].split(":")[1];
  // Get the real base64 content of the file
  const realData = block[1].split(",")[1];

  const byteCharacters = atob(realData);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: contentType });

  return blob;
}

// Upload all base64 images to the server and replace editor state with the new image URLs.
async function uploadImage(base64String: string) {
  const blob = base64ToBlob(base64String);
  // Create a form data object and append the blob to it
  const formData = new FormData();
  formData.append("file", blob, `image${uuidv4()}.png`);
  try {
    // Send the form data to the server
    const res = await fetch("http://127.0.0.1:5000/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (!data.url) {
      throw new Error("Upload failed");
    }
    console.log(data);
    // Replace the image node with the new URL
    return data.url;
  } catch (error) {
    console.error(error);
    return null;
  }
}

interface Node {
  type: string;
  children?: Node[];
  src?: string;
}

// Recursively traverse the node tree and upload all images
async function loopThroughAllNodes(node: Node) {
  if (node.type === "image") {
    let newSrc = await uploadImage(node.src!);
    if (newSrc) {
      node.src = newSrc;
    }
  } else if (node.children) {
    for (let i = 0; i < node.children.length; i++) {
      node.children[i] = await loopThroughAllNodes(node.children[i]);
    }
  }
  return node;
}

export async function uploadAllImages(content: string) {
  const newNode = await loopThroughAllNodes(JSON.parse(content!).root);
  return JSON.stringify({ root: newNode });
}
