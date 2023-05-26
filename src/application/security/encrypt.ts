import { createCipheriv, createDecipheriv } from 'node:crypto'
const algorithm = 'aes-256-cbc'
const key = Buffer.from(
  '4e53b9ae8436a7462f53ec07daaea7173d1cafb8e029d544d5e2b4ec85534ce8',
  'hex',
)
const iv = Buffer.from('ea09d5e07484641d91d6f0d23972809f', 'hex')

export function encrypt(data: string) {
  const cipher = createCipheriv(algorithm, key, iv)
  let encrypted = cipher.update(data, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  return encrypted
}

export function decrypt(encrypted: string) {
  const decipher = createDecipheriv(algorithm, key, iv)
  let decrypted = decipher.update(encrypted, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}
