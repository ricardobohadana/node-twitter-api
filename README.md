# Criação do projeto

1.  Rodar script de criação de pacote: `npm init -y`
2.  Instalar dependências de desenvolvimento para utilização do typescript:

    - `npm install typescript -D`
    - `npm install tsx -D` ➡️ rodar a aplicação no node com ts
    - `npm install tsup -D` ➡️ serve para fazer o build da aplicação de ts para js
    - `npx tsc --init` ➡️ inicializar as configurações do ts
    - Normalmente, costumo alterar o target do tsconfig para 2020
    - Para trabalhar com typescript no node, instala-se também os tipos das bibliotecas nativas do nodejs com `npm install @types/node -D`

3.  Instalar o eslint para trabalhar com um único estilo de código dentro do repositório. É possível fazer isso de forma manual ou automática

    - De forma automática, rodamos: `npm init @eslint/config` e em seguida respondemos as perguntas sobre o estilo de código que queremos
    - Na forma manual, rodamos `npm install eslint -D` para instalar o eslint como dependência de desenvolvimento no projeto. Em seguida, cria-se o arquivo de configuração do eslint e especifica-se as regras que devem ser aplicadas ao código. Para esta api, utilizarei a configuração automática.
    - Criar arquivo .eslintignore e colocar as pastas `node_modules` e `build` dentro dele.
    - `npm i -D eslint-config-standard  @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-plugin-prettier eslint-config-prettier eslint-plugin-import`

    - <details>
       <summary>Conteúdo do arquivo `.eslintrc.json`</summary>
         <p>

      ```json
      {
        "env": {
          "es2021": true,
          "node": true
        },
        "extends": ["standard", "plugin:prettier/recommended"],
        "parser": "@typescript-eslint/parser",
        "parserOptions": {
          "ecmaVersion": "latest",
          "sourceType": "module"
        },
        "plugins": ["@typescript-eslint"],
        "rules": {
          "prettier/prettier": [
            "error",
            {
              "printWidth": 95,
              "tabWidth": 2,
              "singleQuote": true,
              "trailingComma": "all",
              "arrowParens": "always",
              "semi": false
            }
          ]
        },
        "settings": {
          "import/parsers": {
            "@typescript-eslint/parser": [".ts", ".tsx", ".d.ts"]
          }
        }
      }
      ```

         </p>

      </details>

# Primeiro teste unitário

1. Configurando o Vitest:
   - `npm install vitest -D`
   - `npm i -D @faker-js/faker`
2. Criando os scripts de teste:
   - `"test": "vitest run --dir tests/use-cases"`
   - `"test:watch": "vitest --dir tests/use-cases"`
3. Existem duas abordagens na construção de testes unitários para a sua aplicação
   - A primeira abordagem consiste em criar _`InMemoryDatabaseRepositories`_ para lidar com os testes
   - A segunda consiste em fazer um _`mock`_ dos repositórios para testar os casos de uso.
   - Neste treinamento, vamos optar pelo _`mock`_ do repositório instalando o pacote
     - ` npm install vitest-mock-extended -D`.
   - Comando para verificar a cobertura dos testes: `"test:coverage": "vitest --coverage"`

# Primeiro use-case

![image](https://miro.medium.com/v2/resize:fit:4800/format:webp/1*0R0r00uF1RyRFxkxo3HVDg.png)

# Adicionando a camada de dados da aplicação

Utilizaremos um ORM chamado `Prisma`, bastante conhecido no mundo do _nodejs_ devido à sua performance e integração fantástica com o Typescript. Para isso, instalaremos o pacote com `npm install prisma`
No link abaixo está a documentação do prisma sobre como iniciar o setup de acordo com os diferentes banco de dados que você está trabalhando. Aqui utilizaremos o SQL Server.

- https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases/connect-your-database-typescript-sqlserver

- Então, iniciamos da seguinte forma: `npx prisma init --datasource-provider sqlserver`. O comando criará uma pasta chamada `prisma` na raíz do projeto contendo um arquivo `schema.prisma`, que será utilizado na criação das tabelas da aplicação.

- Recomenda-se que você tenha a extensão do VS Code `Prisma` instalada, bem como a seguinte configuração no seu `settings.json`
- `"[prisma]": { "editor.formatOnSave": true, "editor.defaultFormatter": "Prisma.prisma" }`

Define-se os modelos das entidades/tabelas dos bancos de dados e faz-se a migração com o comando `npx prisma migrate dev`

# Primeiro teste e2e

Para realizarmos testes e2e sem precisar iniciar nossa aplicação, utilizamos o pacote `supertest`

- `npm install supertest -D`
- `npm install @types/supertest -D`

Para não utilizarmos o banco populado para testes, criaremos um ambiente de testes separado que, para cada teste, irá gerar um banco de dados diferente para rodarmos nossos testes e2e de forma independente. Por isso, criamos o pacote _`vitest-environment-prisma`_ dentro da nossa pasta do prisma. Precisaremos instalar o pacote abaixo para rodar os scripts de criação e exclusão do banco de dados e link da aplicação a cada teste e2e.

- `npm install npm-run-all -D`

Além disso, rodamos `npm init -y` dentro da pasta criada acima e criamos um arquivo chamado `prisma-test-environment.ts`. Devemos colocar esse arquivo como ponto de entrada no package.json criado (dentro da propriedade main). Dentro deste arquivo, colocaremos o código responsável pela criação de um novo ambiente a cada teste e2e.
Faremos, então o link dele com a nossa aplicação por meio de dois scripts que vão rodar outros dois scripts utilizando o pacote `npm-run-all`

- `"test:create-prisma-environment": "npm link ./prisma/vitest-environment-prisma"`
- `"test:install-prisma-environment": "npm link vitest-environment-prisma"`
- `"pretest:e2e": "run-s test:create-prisma-environment test:install-prisma-environment"`
- `"test:e2e": "vitest run --dir src/tests/http"`

- <details>
     <summary>Conteúdo do arquivo `prisma-test-environment.ts`</summary>

  ```ts
  function generateDatabaseUrl(slug: string) {
    if (!process.env.DATABASE_URL) {
      throw new Error(
        "Por favor, indique uma DATABASE_URL nas variáveis de ambiente."
      );
    }

    const url = process.env.DATABASE_URL.replace("dev", file);

    return url;
  }

  export default <Environment>{
    name: "prisma",
    async setup() {
      const file = randomUUID();
      const databaseURL = generateDatabaseUrl(file);
      process.env.DATABASE_URL = databaseURL;
      execSync("npx prisma migrate deploy");

      return {
        async teardown() {
          const database = `Treinamentos${file}`;
          const sqlCommand = `USE tempdb;
          DECLARE @SQL nvarchar(1000);
          IF EXISTS (SELECT 1 FROM sys.databases WHERE [name] = N'${database}')
          BEGIN
            SET @SQL = N'USE [${database}];
            ALTER DATABASE [${database}] SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
            USE [tempdb];
            DROP DATABASE [${database}];';
            EXEC (@SQL);
          END;`;
          await prisma.$executeRawUnsafe(sqlCommand);
          await prisma.$executeRawUnsafe(
            `DROP SCHEMA IF EXISTS "${slug}" CASCADE`
          );
          await prisma.$disconnect();
        },
      };
    },
  };
  ```

  </details>

Também é necessário criar um arquivo de configuração do Vitest, para configurar a utilização do ambiente de testes.
Basta criar o arquivo `vitest.config.ts` e preenchê-lo conforme código abaixo.
Também configurarei os paths relativos do typescript para conseguirmos melhorar um pouco os imports relativos da aplicação

- <details>
     <summary>Conteúdo do arquivo `prisma-test-environment.ts`</summary>

  ```ts
  import { defineConfig } from "vitest/config";

  import tsconfigPaths from "vite-tsconfig-paths";

  export default defineConfig({
    plugins: [tsconfigPaths()],
    test: {
      environmentMatchGlobs: [["tests/e2e/**", "prisma"]],
    },
  });
  ```

  </details>

Para iniciar os testes `end-2-end`, precisamos garantir que nossa variável `app`, que instancia o servidor http, está pronta. Para isso:

- <details>
     <summary>código</summary>

  ```ts
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });
  ```

  </details>

# Início do desenvolvimento da API

Para este treinamento iremos utilizar o pacote `fastify` em detrimento do famoso `express`. A principal motivação para tal decisão é o fato de o express ter atingido seu estado máximo de desenvolvimento, enquanto o `fastify` é mantido de forma mais ativa, com melhor suporte e uma melhora considerável na performance.
Assim: `npm install fastify`

Para começar a configuração da API, precisamos também configurar as variáveis de ambiente da nossa aplicação. Para isso, precisaremos instalar duas bibliotecas amplamente utilizadas pela comunidade:

- `npm install dotenv` ➡️ identificação das variáveis de ambiente
- `npm install zod`. ➡️ validação dos tipos

Para rodar a aplicação, precisaremos de alguns scripts dentro do nosso arquivo `package.json`. Incialmente, vamos contruir 3 scripts:

- `"dev": "tsx watch src/server.ts"` ➡️ roda nossa aplicação como typescript e em modo "watch", esperando por atualizações para reiniciar e aplicá-las automaticamente.
- `"build": "tsup src --out-dir build"` ➡️ responsável pela transformação da aplicação ts em js para o processo de deploy
- `"start": "build/server.js"` ➡️ responsável pelo início da aplicação definitiva js (production ready version)
