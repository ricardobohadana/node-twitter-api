import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { Environment } from 'vitest'
import { prisma } from '@/data/prisma/client'

function generateDatabaseUrl(slug: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Por favor, indique uma DATABASE_URL nas variáveis de ambiente.')
  }

  const url = process.env.DATABASE_URL.replace('Dev', slug)

  return url
}

export default <Environment>{
  name: 'prisma',
  async setup() {
    const file = randomUUID()
    const databaseURL = generateDatabaseUrl(file)
    process.env.DATABASE_URL = databaseURL
    execSync('npx prisma migrate deploy')

    return {
      async teardown() {
        const database = `Treinamentos${file}`
        const sqlCommand = `USE tempdb;
        DECLARE @SQL nvarchar(1000);
        IF EXISTS (SELECT 1 FROM sys.databases WHERE [name] = N'${database}')
        BEGIN
          SET @SQL = N'USE [${database}];
          ALTER DATABASE [${database}] SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
          USE [tempdb];
          DROP DATABASE [${database}];';
          EXEC (@SQL);
        END;`
        await prisma.$executeRawUnsafe(sqlCommand)
        await prisma.$disconnect()
      },
    }
  },
}
