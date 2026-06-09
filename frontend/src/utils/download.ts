export async function downloadImage(url: string, publicId: string): Promise<void> {
  const response = await fetch(url);
  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = objectUrl;
  a.download = `${publicId}.png`;
  a.click();
  URL.revokeObjectURL(objectUrl);
}
