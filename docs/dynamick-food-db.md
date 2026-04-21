# DynamicK Food — Schema do Banco de Dados

---

## Visão Geral das Tabelas

| Tabela | Descrição |
|---|---|
| `users` | Acesso ao sistema — e-mail, senha, role |
| `companies` | Perfil do cliente (empresa) |
| `drivers` | Perfil do entregador |
| `vehicles` | Veículos dos entregadores |
| `documents` | Documentos unificados (entregador e veículo) |
| `deliveries` | Corridas |
| `payments` | Pagamentos |
| `ratings` | Avaliações |
| `notifications` | Notificações |

---

## Tabelas

> **Convenção de colunas:** os campos usam camelCase no banco (sem `@map`). Ex: `createdAt`, `userId`.

### users
Responsável pelo acesso ao sistema. Todo mundo que faz login passa por aqui — cliente, entregador e admin.

| Campo | Tipo | Observações |
|---|---|---|
| `id` | uuid | PK |
| `email` | string | único |
| `password` | string | hash bcrypt |
| `role` | enum | `CUSTOMER` \| `DRIVER` \| `ADMIN` |
| `createdAt` | datetime | |
| `updatedAt` | datetime | |

---

### companies
Perfil da empresa cliente. Vinculada a um `user` com role `CUSTOMER`.

| Campo | Tipo | Observações |
|---|---|---|
| `id` | uuid | PK |
| `userId` | uuid | FK → users, único |
| `name` | string | razão social |
| `cnpj` | string | único |
| `phone` | string | |
| `createdAt` | datetime | |
| `updatedAt` | datetime | |

---

### drivers
Perfil do entregador. Vinculado a um `user` com role `DRIVER`.

| Campo | Tipo | Observações |
|---|---|---|
| `id` | uuid | PK |
| `userId` | uuid | FK → users, único |
| `name` | string | |
| `cpf` | string | único |
| `cnh` | string | número da CNH |
| `phone` | string | |
| `status` | enum | `PENDENTE` \| `ATIVO` \| `REJEITADO` |
| `rejectionReason` | string | nullable — motivo da rejeição |
| `createdAt` | datetime | |
| `updatedAt` | datetime | |

---

### vehicles
Veículos cadastrados por um entregador. Um entregador pode ter múltiplos veículos, mas apenas um ativo por vez.

| Campo | Tipo | Observações |
|---|---|---|
| `id` | uuid | PK |
| `driverId` | uuid | FK → drivers |
| `plate` | string? | placa — único, nullable (ex: bicicletas não têm placa) |
| `type` | enum | `MOTO` \| `CARRO` \| `VAN` \| `BICICLETA` |
| `brand` | string | marca |
| `model` | string | modelo |
| `year` | int | ano |
| `color` | string | |
| `isActive` | boolean | apenas um veículo ativo por entregador |
| `createdAt` | datetime | |
| `updatedAt` | datetime | |

---

### documents
Tabela unificada de documentos. Usa FKs explícitas e nullable para cada tipo de dono, em vez de campo polimórfico `ownerId`. Apenas uma FK estará preenchida por registro.

| Campo | Tipo | Observações |
|---|---|---|
| `id` | uuid | PK |
| `driverId` | uuid? | FK → drivers, nullable |
| `vehicleId` | uuid? | FK → vehicles, nullable |
| `companyId` | uuid? | FK → companies, nullable |
| `ownerType` | enum | `DRIVER` \| `VEHICLE` \| `COMPANY` |
| `type` | enum | `CNH` \| `SELFIE` \| `COMPROVANTE_RESIDENCIA` \| `CRLV` \| `FOTO_VEICULO` \| `CNPJ` \| `CONTRATO_SOCIAL` \| `DOCUMENTO_RESPONSAVEL` |
| `originalName` | string | nome original do arquivo |
| `storagePath` | string | caminho no R2/S3 |
| `mimeType` | string | ex: `image/jpeg`, `application/pdf` |
| `size` | int | tamanho em bytes |
| `status` | enum | `PENDENTE` \| `APROVADO` \| `REJEITADO` |
| `createdAt` | datetime | |
| `updatedAt` | datetime | |

---

### deliveries
Corridas. Registra todo o ciclo de uma entrega, incluindo qual veículo foi utilizado.

| Campo | Tipo | Observações |
|---|---|---|
| `id` | uuid | PK |
| `companyId` | uuid | FK → companies |
| `driverId` | uuid? | FK → drivers — nullable até ser aceita |
| `vehicleId` | uuid? | FK → vehicles — nullable até ser aceita |
| `pickupAddress` | string | endereço de coleta |
| `pickupLat` | float | |
| `pickupLng` | float | |
| `deliveryAddress` | string | endereço de entrega |
| `deliveryLat` | float | |
| `deliveryLng` | float | |
| `itemType` | string | tipo do item |
| `observations` | string? | nullable |
| `distanceKm` | float | calculado no momento da solicitação |
| `estimatedTime` | int | em minutos |
| `totalPrice` | decimal | valor total calculado |
| `confirmationCode` | string | código para confirmar entrega |
| `status` | enum | ver seção de status abaixo |
| `acceptedAt` | datetime? | nullable |
| `pickedUpAt` | datetime? | nullable |
| `deliveredAt` | datetime? | nullable |
| `canceledAt` | datetime? | nullable |
| `realDistanceKm` | float? | nullable — distância real ao finalizar |
| `realDuration` | int? | nullable — tempo real em minutos |
| `createdAt` | datetime | |
| `updatedAt` | datetime | |

**Status possíveis:**
```
PROCURANDO
ACEITA
A_CAMINHO_COLETA
AGUARDANDO_COLETA
EM_ENTREGA
FINALIZADA
CANCELADA
SEM_ENTREGADOR
CANCELADA_PELO_CLIENTE
CANCELADA_PELO_ENTREGADOR
```

---

### payments
Pagamentos vinculados a uma corrida.

| Campo | Tipo | Observações |
|---|---|---|
| `id` | uuid | PK |
| `deliveryId` | uuid | FK → deliveries, único |
| `amount` | decimal | valor cobrado |
| `method` | enum | `PIX` \| `CARTAO` \| `CARTEIRA` |
| `status` | enum | `PENDENTE` \| `PAGO` \| `ESTORNADO` \| `FALHOU` |
| `paidAt` | datetime? | nullable |
| `createdAt` | datetime | |
| `updatedAt` | datetime | |

---

### ratings
Avaliações feitas pelo cliente após a entrega. `score` armazena o voto individual (inteiro 1–5). Média calculada dinamicamente via `AVG()` — não armazenada.

| Campo | Tipo | Observações |
|---|---|---|
| `id` | uuid | PK |
| `deliveryId` | uuid | FK → deliveries, único por corrida |
| `companyId` | uuid | FK → companies — quem avaliou |
| `driverId` | uuid | FK → drivers — quem foi avaliado |
| `score` | int | 1 a 5 — voto individual |
| `comment` | string? | nullable |
| `createdAt` | datetime | |

---

### notifications
Notificações enviadas para usuários do sistema. Limpeza automática a cada 15 dias.

| Campo | Tipo | Observações |
|---|---|---|
| `id` | uuid | PK |
| `userId` | uuid | FK → users |
| `title` | string | |
| `body` | string | conteúdo da notificação |
| `type` | string | ex: `ENTREGA_ACEITA`, `ENTREGADOR_CHEGOU` |
| `read` | boolean | se foi lida |
| `createdAt` | datetime | |

---

## Pontos em Aberto

- **Taxa de espera na coleta:** definir se a cobrança recai sobre o cliente ou é absorvida pelo sistema
- **Penalidade por cancelamento do entregador:** regra ainda não definida — registrar ocorrência ou bloquear temporariamente?
- **Taxa dinâmica:** multiplicador por horário de pico e demanda — valores a definir antes de ir para produção
- **Valores da taxa base e por km:** os valores de exemplo (R$5,00 base + R$2,50/km) resultam em custo alto para o consumidor — revisar com o cliente
