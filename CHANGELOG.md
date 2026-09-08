# Log de desenvolvimento - Minha Loja

## Visão geral
Este documento registra a evolução do projeto, os ajustes realizados, as correções de bugs, as tecnologias envolvidas e os comandos usados para validar o funcionamento da aplicação.

O objetivo foi construir uma loja de e-commerce funcional em Next.js com TypeScript, usando uma base de dados SQLite via Prisma, um carrinho em frontend e fluxo de checkout completo.

---

## 1) Objetivo do projeto
A proposta foi criar uma loja simples, mas completa, com:
- página inicial
- catálogo de produtos
- página de detalhe por slug
- carrinho funcional
- checkout
- confirmação de compra
- integração com banco para registrar pedidos
- validação final de build e geração do Prisma

---

## 2) O que foi construído

### 2.1 Página inicial
- criação da landing page da loja
- hero section com chamada principal
- destaques de categorias e benefícios
- botão de navegação para produtos
- contador do carrinho visível no topo

### 2.2 Catalogo de produtos
- listagem com cards de produtos
- título, imagem, descrição e preço
- busca por nome
- filtro por categoria
- mensagem quando nenhum produto é encontrado

### 2.3 Detalhes do produto
- página dinâmica em `/produtos/[slug]`
- exibição de imagem, descrição, preço e informação do item
- botão para adicionar ao carrinho
- suporte ao slug como identificador do produto

### 2.4 Carrinho
- armazenamento local em `localStorage`
- funções para adicionar, remover, atualizar quantidade e limpar
- atualização em tempo real do contador do carrinho
- resumo do pedido com subtotal, total e ações

### 2.5 Checkout
- formulário com dados do cliente
- resumo do pedido
- botão de finalizar compra
- envio para a rota de API do checkout

### 2.6 Página de sucesso
- confirmação após a compra
- exibição do pedido ou referência do processo
- ajuste para funcionar corretamente com `useSearchParams` no Next.js 16

### 2.7 Persistência com Prisma
- criação de estrutura de banco para pedidos e itens do pedido
- integração do checkout com a API para salvar no SQLite
- conexão centralizada via `src/lib/prisma.ts`

---

## 3) Ajustes e correções aplicadas

### 3.1 Correção do carrinho
Problema: ao adicionar um produto, o contador e a lógica de carrinho estavam inconsistentes e alguns itens eram tratados como se fossem todos iguais.

Ajuste:
- a lógica passou a identificar cada item pelo `id`
- a quantidades foram tratadas corretamente por produto
- o contador passou a refletir o total real dos itens no carrinho

### 3.2 Correção de 404 nas páginas de produto
Problema: o Next.js 16 passa `params` como Promise, e a página dinâmica estava montada com a assinatura antiga.

Ajuste:
- foi necessário usar `await params` dentro da rota dinâmica
- a página de detalhe passou a carregar corretamente o produto pelo slug

### 3.3 Ajuste de imagens remotas
Problema: imagens externas do Unsplash foram bloqueadas pelo Next.js por configuração de domínio.

Ajuste:
- foi necessário permitir o domínio externo na configuração do projeto
- a renderização com `next/image` passou a funcionar corretamente

### 3.4 Ajuste da página de sucesso
Problema: `useSearchParams` exige um contexto compatível com Suspense no App Router do Next.js 16.

Ajuste:
- a página de confirmação foi envolvida em `Suspense`
- isso permitiu que a rota funcionasse corretamente sem quebrar a renderização

### 3.5 Ajuste do Prisma para SQLite
Problema: a integração com Prisma não estava funcionando corretamente devido à configuração do adapter do SQLite e ao uso da instância do cliente.

Ajuste:
- foi criado o arquivo `src/lib/prisma.ts` com singleton seguro
- foi usado `PrismaBetterSqlite3` para o SQLite
- foi ajustado o nome correto do adapter e a inicialização do `PrismaClient`
- a variável global foi usada para evitar múltiplas instâncias durante o desenvolvimento

### 3.6 Validação final de build
Problema: o projeto tinha que garantir que o Prisma gere corretamente o cliente e que a build final da aplicação funcione sem erros.

Ajuste:
- foi executado o processo de geração do cliente Prisma
- foi validada a build completa do Next.js
- o projeto foi confirmado em estado funcional

---

## 4) Arquivos principais do projeto

### 4.1 `app/page.tsx`
Página inicial da loja. Responsável pela landing page, destaques e navegação.

### 4.2 `app/produtos/page.tsx`
Página do catálogo. Exibe produtos, busca e filtros.

### 4.3 `app/produtos/[slug]/page.tsx`
Página dinâmica do produto. Carrega o item pelo slug e informa detalhes.

### 4.4 `app/carrinho/page.tsx`
Tela do carrinho. Permite visualizar itens, alterar quantidade e finalizar compra.

### 4.5 `app/checkout/page.tsx`
Tela de checkout. Coleta dados do cliente e envia o pedido para a API.

### 4.6 `app/api/checkout/route.ts`
Endpoint responsável por receber a compra e persistir os dados usando Prisma.

### 4.7 `src/lib/cart.ts`
Centraliza a lógica do carrinho no frontend, com leitura e escrita em `localStorage`.

### 4.8 `src/lib/prisma.ts`
Conecta a aplicação ao banco SQLite usando o Prisma e seu adapter correto.

### 4.9 `prisma/schema.prisma`
Define os modelos de banco, como produtos, pedidos e itens do pedido.

---

## 5) Comandos principais e o que cada um faz

### 5.1 `npm install`
Instala todas as dependências do projeto conforme o `package.json`.

Função:
- baixa pacotes do Node
- prepara o ambiente para rodar o projeto
- garante que o Prisma, Next.js, TypeScript e demais bibliotecas estejam disponíveis

### 5.2 `npm run dev`
Inicia a aplicação em modo de desenvolvimento.

Função:
- sobe o servidor local do Next.js
- habilita hot reload
- permite testar a loja em tempo real enquanto edita arquivos

### 5.3 `npm run build`
Gera a build de produção da aplicação.

Função:
- compila o projeto Next.js
- valida se há erros de TypeScript e de build
- prepara a aplicação para deploy ou execução em produção

### 5.4 `npx prisma generate`
Gera o client do Prisma com base no schema do banco.

Função:
- lê o arquivo `prisma/schema.prisma`
- produz os tipos e a client API do Prisma
- necessário toda vez que o schema é alterado ou quando há novos adapters/configurações

### 5.5 `npx tsc --noEmit`
Executa a checagem de tipos do TypeScript sem gerar arquivos de saída.

Função:
- valida se o código está tipado corretamente
- detecta erros de compilação antes do build final
- ajuda a evitar bugs de runtime causados por inconsistências de tipos

### 5.6 `npx prisma generate && npm run build`
Executa duas validações em sequência.

Função:
- primeiro gera o cliente Prisma
- depois compila a aplicação
- é uma validação robusta do estado final do projeto

### 5.7 `npx prisma migrate dev --name <nome>`
Cria e aplica migrações do banco de dados.

Função:
- evolui o schema do banco de forma controlada
- registra mudanças em versionamento do Prisma
- útil para manter estrutura do banco sincronizada com o código

> Esse comando foi importante para o gerenciamento do banco em desenvolvimento, mesmo que o projeto tenha usado SQLite local e o schema já estivesse consolidado.

---

## 6) Status final
O projeto chegou a um estado funcional e estável, com:
- loja com catálogo e detalhes
- carrinho funcionando
- checkout integrado
- confirmação de compra
- banco SQLite em Prisma
- build validada com sucesso

Em resumo, o projeto foi transformado em uma loja básica de e-commerce com fluxo completo e estrutura pronta para evoluir.

---

## 7) Observações finais
- O carrinho funciona em frontend usando `localStorage`.
- A persistência de pedidos está conectada ao Prisma/SQLite.
- O fluxo foi ajustado para Next.js 16, que exige atenção especial em rotas dinâmicas e `useSearchParams`.
- A validação final foi confirmada com geração do Prisma e build do projeto sem erro.

---

## 8) Próximos passos possíveis
Se amanhã o projeto continuar, os próximos refinamentos mais naturais são:
- painel administrativo de pedidos
- cadastro de produtos pelo admin
- cupom de desconto real
- cálculo de frete
- paginação e filtros avançados
- autenticação de cliente
- melhoria na UX do checkout

---

## 9) Ajuste pausado e próximo passo de amanhã

### Estado atual do projeto
O projeto está em estado funcional e validado:
- loja com catálogo e detalhes
- carrinho funcional
- checkout com confirmação
- integração com Prisma e SQLite
- build verificada sem erro

### Ajuste que foi pausado
O ponto que ficou parado foi a evolução do fluxo de pedidos para além do MVP inicial:
- painel de administração de pedidos
- visão de pedidos cadastrados
- controle de status do pedido
- refinamento de regras de negócio e UX do checkout

### O que precisa seguir amanhã
O próximo ajuste recomendado é:
1. consolidar a parte de gerenciamento de pedidos e status;
2. validar se a compra salva corretamente o pedido e os itens no banco;
3. criar uma tela ou estrutura para visualizar os pedidos cadastrados;
4. melhorar a experiência do checkout com regras mais completas, como frete, total detalhado e feedback visual mais robusto.

### Ordem lógica recomendada para amanhã
- revisar a estrutura atual de `Order` e `OrderItem`
- confirmar se o fluxo de criação do pedido está consistente
- melhorar a interface de confirmação e resumo do pedido
- preparar a próxima etapa de gestão/administração

### Resumo em uma frase
O ajuste que ficou em pausa foi o refinamento do processo de pedidos e a evolução da loja de MVP para uma estrutura mais profissional de e-commerce.

---

## 10) Conclusão
Este registro serve como histórico de evolução da loja, mostrando não só o que foi implementado, mas também os pontos de atenção e correções necessárias para manter a aplicação funcionando corretamente em uma stack moderna com Next.js e Prisma.

O projeto está documentado, validado e pronto para continuar evoluindo no próximo passo.
