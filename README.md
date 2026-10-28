# AulaFácil

**Nicho:** Aulas particulares (música, idiomas, reforço) · **Grupo:** 19

**Aluno:** Anthony Tavares Nascimento ([@onoobze1](https://github.com/onoobze1))

**Sistema no ar:** https://aula-facil.vercel.app

**GitHub:** https://github.com/onoobze1/aula-facil

## O que o sistema faz

O AulaFácil é um site que desenvolvi para divulgar aulas particulares de idiomas, música e reforço escolar.

Nele, é possível ver as aulas disponíveis, consultar seus detalhes e, depois de fazer login, cadastrar e editar as próprias aulas. O sistema também possui validação dos dados e permite enviar imagens para as aulas.

## Páginas para testar

- **Página pública:** https://aula-facil.vercel.app/
- **Login:** https://aula-facil.vercel.app/login
- **Cadastro de aulas:** https://aula-facil.vercel.app/aulas/novo
- **Versão da aplicação:** https://aula-facil.vercel.app/api/versao

As páginas que precisam de login devem impedir o acesso de quem não está autenticado.

## Banco de dados

Utilizei PostgreSQL, hospedado no Neon, e Prisma ORM para acessar e organizar os dados.

### Entidades e relacionamentos

- **User:** armazena os dados dos usuários.
- **Aula:** armazena o título, a descrição, a categoria, o preço, a imagem e o professor responsável.
- **Relacionamento:** cada aula pertence a um professor, e um professor pode cadastrar várias aulas.

As alterações na estrutura do banco ficam registradas na pasta `prisma/migrations`.

## Como rodar no computador

### Requisitos

- Node.js compatível com o projeto.
- npm.
- Variáveis de ambiente configuradas para acessar o banco de dados e os serviços utilizados.

### Instalação

1. Clonar o repositório:

   ```bash
   git clone https://github.com/onoobze1/aula-facil.git
   cd aula-facil
   ```

2. Instalar as dependências:

   ```bash
   npm install
   ```

3. Criar o arquivo `.env` com as variáveis necessárias, seguindo o modelo `.env.example`.

4. Configurar o banco de dados e gerar o cliente do Prisma conforme as instruções do projeto.

5. Iniciar o servidor:

   ```bash
   npm run dev
   ```

6. Acessar http://localhost:3000.

O arquivo `.env` contém informações privadas e não deve ser enviado ao GitHub. O repositório deve conter apenas o `.env.example`, sem senhas ou tokens reais.

## Como usei a IA

- **IA usada:** ChatGPT.

### Os 3 pedidos que mais me ajudaram

1. Ajudar a criar o cadastro de aulas utilizando Next.js, Prisma e validação dos dados.
2. Ajudar a corrigir os problemas que apareceram durante a configuração do upload de imagens com Vercel Blob.
3. Ajudar a implementar a edição de aulas, verificando se o usuário está logado e se é o responsável pela aula.

### Um erro da IA e como corrigi

Durante a configuração do upload de imagens, ocorreu um erro porque o código tentava utilizar acesso público em um armazenamento privado do Vercel Blob.

Para corrigir, configurei um armazenamento público e ajustei o código e as variáveis de ambiente para utilizar esse armazenamento. Depois, testei novamente o envio das imagens.

### O que aprendi

Aprendi a criar e publicar um site utilizando Next.js, a conectar o sistema a um banco de dados, a implementar login, a validar formulários e a enviar imagens para a nuvem.

Também aprendi que a IA pode cometer erros e que é importante testar o código, entender as mensagens de erro e conferir se as soluções realmente funcionam.
