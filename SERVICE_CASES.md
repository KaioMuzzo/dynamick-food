# Service Cases

Mapa de cenários de teste por função de service.
Validado pelo desenvolvedor — consumido pela skill service-test-writer.

---

## auth — service.ts

### registerCompany(data: RegisterCompanyInput)

| # | Cenário | Input | Esperado |
|---|---|---|---|
| 1 | Dados válidos | name, cnpj, phone, email, password válidos | retorna void, user + company criados no banco |
| 2 | Email já existente | email de um user já cadastrado | Prisma lança P2002, propagado como CONFLICT |
| 3 | CNPJ já existente | cnpj de uma company já cadastrada | Prisma lança P2002, propagado como CONFLICT |

### registerDriver(data: RegisterDriverInput)

| # | Cenário | Input | Esperado |
|---|---|---|---|
| 1 | Dados válidos | name, cpf, cnh, phone, email, password válidos | retorna { id }, user + driver criados com status PENDENTE |
| 2 | Email já existente | email de um user já cadastrado | Prisma lança P2002, propagado como CONFLICT |
| 3 | CPF já existente | cpf de um driver já cadastrado | Prisma lança P2002, propagado como CONFLICT |

---
