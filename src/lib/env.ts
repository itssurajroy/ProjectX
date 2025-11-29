
import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_HIANIME_API_BASE: z.string().url(),
});

// We need to use process.env here to get the environment variables from the system.
// The .env file is loaded automatically by Next.js.
// On the server, we can use the internal proxy URL. On the client, it will be undefined
// and will use the relative path which will be handled by the Next.js proxy.
const envObject = {
    NEXT_PUBLIC_HIANIME_API_BASE: process.env.NEXT_PUBLIC_HIANIME_API_BASE || 'https://aniwatch-api-five-dusky.vercel.app/api/v2/hianime',
};

// This will throw an error if the environment variables are missing or invalid.
export const env = envSchema.parse(envObject);

