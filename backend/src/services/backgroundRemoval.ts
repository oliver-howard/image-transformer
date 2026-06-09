import { config } from "../config";
import { UpstreamError } from "../errors";

interface RemoveBgErrorResponse {
  errors: Array<{ title: string }>;
}

const TIMEOUT_MS = 30_000;

export async function removeBackground(
  imageBuffer: Buffer,
  mimeType: string
): Promise<Buffer> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let response: Response;
  try {
    const form = new FormData();
    const blob = new Blob([imageBuffer], { type: mimeType });
    form.append("image_file", blob, "image");
    form.append("size", "auto");

    response = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: { "X-Api-Key": config.removeBgApiKey },
      body: form,
      signal: controller.signal,
    });
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new UpstreamError(`remove.bg request timed out after ${TIMEOUT_MS}ms`);
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    const body = (await response.json()) as RemoveBgErrorResponse;
    const message =
      body.errors?.map((e) => e.title).join(", ") ?? "Unknown error";
    throw new UpstreamError(`remove.bg API error ${response.status}: ${message}`);
  }

  const contentType = response.headers.get("content-type");
  if (!contentType?.startsWith("image/")) {
    throw new UpstreamError(
      `remove.bg returned unexpected content-type: ${contentType ?? "none"}`
    );
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
