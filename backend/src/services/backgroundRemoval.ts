import { config } from "../config";

interface RemoveBgErrorResponse {
  errors: Array<{ title: string }>;
}

export async function removeBackground(
  imageBuffer: Buffer,
  mimeType: string
): Promise<Buffer> {
  const form = new FormData();
  const blob = new Blob([imageBuffer], { type: mimeType });
  form.append("image_file", blob, "image");
  form.append("size", "auto");

  const response = await fetch("https://api.remove.bg/v1.0/removebg", {
    method: "POST",
    headers: { "X-Api-Key": config.removeBgApiKey },
    body: form,
  });

  if (!response.ok) {
    const body = (await response.json()) as RemoveBgErrorResponse;
    const message =
      body.errors?.map((e) => e.title).join(", ") ?? "Unknown error";
    throw new Error(`remove.bg API error ${response.status}: ${message}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
