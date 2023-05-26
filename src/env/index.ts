import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string(),
  HOST: z.string(),
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  const error = '⚠️ Invalid environment variables!\n'
  console.error(error, _env.error.format())
  throw new Error(error)
}

export const env = _env.data
