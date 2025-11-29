import { z } from 'zod';

const envSchema = z.object({
  HIANIME_API_BASE: z.string().url(),
});

export const env = envSchema.parse({
  HIANIME_API_BASE: process.env.NEXT_PUBLIC_HIANIME_API_BASE,
});
