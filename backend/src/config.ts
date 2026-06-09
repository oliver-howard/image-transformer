function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const config = {
  port: process.env.PORT ?? "3001",
  frontendUrl: process.env.FRONTEND_URL ?? "http://localhost:5173",
  removeBgApiKey: requireEnv("REMOVE_BG_API_KEY"),
  cloudinary: {
    cloudName: requireEnv("CLOUDINARY_CLOUD_NAME"),
    apiKey: requireEnv("CLOUDINARY_API_KEY"),
    apiSecret: requireEnv("CLOUDINARY_API_SECRET"),
  },
};
