import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_CORS_PROXY: z.string().url().optional(),
});

export const env = envSchema.parse({
  NEXT_PUBLIC_CORS_PROXY: process.env.NEXT_PUBLIC_CORS_PROXY,
});
