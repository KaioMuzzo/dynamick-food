# Security Tests

Security test plan per endpoint.
Auto-generated — do not manually edit threat sections.

---

## POST /api/auth/register/company

> Cria um usuário com role `COMPANY` e o perfil de empresa associado. Endpoint público.

**Relevant threats:** Mass Assignment, Sensitive Data Exposure, Verbose Errors, Brute Force

---

### Mass Assignment

- **What to test:** Enviar campos extras no body que não deveriam ser persistidos, como `role: "ADMIN"`, `isActive: true`, `refreshToken: "abc"`.
- **Expected result:** Campos não permitidos são silenciosamente ignorados pelo Zod; nunca persistidos no banco.

---

### Sensitive Data Exposure

- **What to test:** Inspecionar o corpo da resposta de sucesso e de erro em busca de campos sensíveis como `password`, hash bcrypt, ou `refreshToken`.
- **Expected result:** Resposta de sucesso retorna 201 sem corpo; nenhum campo sensível exposto em nenhuma resposta.

---

### Verbose Errors

- **What to test:** Enviar inputs inválidos (body vazio, campos errados, tipos incorretos) e inspecionar o corpo da resposta.
- **Expected result:** Em produção retorna apenas `{ "error": "VALIDATION_ERROR" }` sem stack trace, caminho de arquivo ou detalhe interno.

---

### Brute Force

- **What to test:** Enviar múltiplas requisições em sequência rápida para criação de contas (flood de cadastros).
- **Expected result:** Rate limiter global bloqueia o IP após exceder o limite de requisições, retornando 429.

---

## POST /api/auth/register/driver

> Cria um usuário com role `DRIVER` e o perfil de entregador associado com status `PENDENTE`. Endpoint público.

**Relevant threats:** Mass Assignment, Sensitive Data Exposure, Verbose Errors, Brute Force

---

### Mass Assignment

- **What to test:** Enviar campos extras no body que não deveriam ser persistidos, como `role: "ADMIN"`, `status: "ATIVO"`, `refreshToken: "abc"`.
- **Expected result:** Campos não permitidos são silenciosamente ignorados pelo Zod; status sempre inicia como `PENDENTE`; nunca persistidos no banco.

---

### Sensitive Data Exposure

- **What to test:** Inspecionar o corpo da resposta de sucesso e de erro em busca de campos sensíveis como `password`, hash bcrypt, `cpf`, `cnh` ou `refreshToken`.
- **Expected result:** Resposta de sucesso retorna apenas `{ id: string }`; nenhum campo sensível exposto em nenhuma resposta.

---

### Verbose Errors

- **What to test:** Enviar inputs inválidos (body vazio, campos errados, tipos incorretos) e inspecionar o corpo da resposta.
- **Expected result:** Em produção retorna apenas `{ "error": "VALIDATION_ERROR" }` sem stack trace, caminho de arquivo ou detalhe interno.

---

### Brute Force

- **What to test:** Enviar múltiplas requisições em sequência rápida para criação de contas (flood de cadastros).
- **Expected result:** Rate limiter global bloqueia o IP após exceder o limite de requisições, retornando 429.

---
