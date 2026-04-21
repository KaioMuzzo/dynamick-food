# Test Cases

Mapa de cenários de teste por endpoint.
Gerado automaticamente — não edite manualmente as linhas da tabela.

---

## POST /api/auth/register/company

> Cria um usuário com role `COMPANY` e o perfil de empresa associado. Endpoint público.

| # | Cenário | Input | Esperado |
|---|---|---|---|
| 1 | Dados válidos completos | name, cnpj (14 dígitos), phone, email, password válidos | 201 + { id: string } |
| 2 | Campo `name` ausente | body sem `name` | 400 VALIDATION_ERROR |
| 3 | Campo `cnpj` ausente | body sem `cnpj` | 400 VALIDATION_ERROR |
| 4 | Campo `phone` ausente | body sem `phone` | 400 VALIDATION_ERROR |
| 5 | Campo `email` ausente | body sem `email` | 400 VALIDATION_ERROR |
| 6 | Campo `password` ausente | body sem `password` | 400 VALIDATION_ERROR |
| 7 | Body vazio | `{}` | 400 VALIDATION_ERROR |
| 8 | `name` string vazia | `name: ""` | 400 VALIDATION_ERROR |
| 9 | `cnpj` com menos de 14 dígitos | `cnpj: "1234"` | 400 VALIDATION_ERROR |
| 10 | `cnpj` com mais de 14 dígitos | `cnpj: "123456789012345"` | 400 VALIDATION_ERROR |
| 11 | `phone` com menos de 10 caracteres | `phone: "119999"` | 400 VALIDATION_ERROR |
| 12 | `email` inválido | `email: "nao-é-email"` | 400 VALIDATION_ERROR |
| 13 | `password` com menos de 8 caracteres | `password: "123"` | 400 VALIDATION_ERROR |
| 14 | Email já cadastrado | email de um usuário existente | 409 CONFLICT |
| 15 | CNPJ já cadastrado | cnpj de uma empresa existente | 409 CONFLICT |
