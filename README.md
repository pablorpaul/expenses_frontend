# Sistema de Controle de Despesas Pessoais

Um sistema web simples e moderno para gerenciamento de finanças, focado no cadastro de despesas diárias e organização por categorias. O projeto foi construído utilizando React para a interface e consome serviços integrados de uma API de recursos.

---

## Funcionalidades

**Autenticação (Login):** Tela de acesso seguro para os usuários.
**Dashboard:** Visão geral rápida com métricas do valor total acumulado e a quantidade de despesas registradas.
**Gerenciamento de Categorias:** Cadastro, edição, listagem com busca dinâmica, exclusão e visualização de detalhes das categorias (ex: Alimentação, Transporte, Lazer).
**Gerenciamento de Despesas:** Cadastro completo de gastos (título, valor, descrição, categoria e data), incluindo busca integrada e correção automática de fuso horário na data.

---

## Tecnologias Utilizadas

**React** (com Hooks como `useState`, `useEffect` e `useContext`)
**React Router Dom** (para navegação entre as rotas)
**CSS3** (Estilização baseada em Grid e Flexbox com design responsivo)

---

## Como rodar o projeto localmente

Siga os passos abaixo para clonar e executar o projeto na sua máquina:

1. cd expense_frontend (selecione a pasta do projeto)

2. npm i (para baixar as dependencias do projeto)

3. npm run vite (para inicializar o projeto)

## Necessário Utilizar a api nesse link para integração com backend

https://github.com/pablorpaul/personal-expenses-api
