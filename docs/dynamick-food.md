# DynamicK Food

Plataforma de entregas rápidas com rastreamento em tempo real, matching inteligente de entregadores e gestão completa do ciclo de entrega.

---

## 1. Arquitetura Geral

```
App Mobile (React Native + Expo)
        ↕ REST + WebSocket
Backend API (Node.js + TypeScript)
        ↕
PostgreSQL + Prisma
        ↕
Serviços Externos (Google Maps, Expo Push, Stripe/Mercado Pago)
```

### Backend
- Node.js + TypeScript
- Express
- Prisma ORM + PostgreSQL
- Socket.io (tempo real)
- JWT + Refresh Token
- Zod (validações)
- Multer (uploads)
- Bcrypt

### Infraestrutura
- VPS Hostinger + Nginx + PM2
- Certificado SSL
- Backup diário

### Serviços Externos
- Google Maps API (rotas e distâncias)
- Expo Push Notifications
- Stripe / Mercado Pago (pagamentos)
- Validação de documentos (CNH, CPF, Placa)

---

## 2. Banco de Dados — Tabelas Principais

| Tabela | Descrição |
|---|---|
| `users` | Acesso (e-mail, senha, role) |
| `companies` | Perfil do cliente |
| `drivers` | Entregadores |
| `deliveries` | Corridas |
| `driver_locations` | Localização em tempo real |
| `payments` | Pagamentos |
| `documents` | Documentos enviados |
| `ratings` | Avaliações |
| `notifications` | Notificações |
| `vehicles` | Veículos dos entregadores |

---

## 3. Cadastro de Cliente

1. Preencher: Razão social, CNPJ, Telefone, E-mail, Senha
2. Validar CNPJ (unicidade)
3. Criar usuário com status `ATIVO`
4. Login automático → acesso ao app

---

## 4. Cadastro de Entregador

1. Preencher: Nome, CPF, CNH, Placa, Veículo, E-mail, Telefone, Senha
2. Enviar documentos: Foto CNH, Selfie, Comprovante de Residência
3. Status inicial: `PENDENTE`
4. Fila de análise (admin)
   - Reprovado → status `REJEITADO` + notificação com motivo
   - Aprovado → status `ATIVO` + notificação no app

> **Tempo de aprovação:** Manual 24h–48h. Futuro: OCR + API CNH (automático).

---

## 5. Fluxo Completo de Entrega

### 5.1 Cliente Solicita

- Informa: endereço de coleta, endereço de entrega, tipo de item, observações
- Backend calcula: distância (km), tempo estimado, taxa
- Cliente vê resumo e confirma
- Cria entrega com status `PROCURANDO`

### 5.2 Busca de Entregador

- Buscar entregadores `ONLINE` em raio de 5km
- Ordenar por proximidade
- Enviar oferta para os 3 mais próximos
- Timeout: 20 segundos por entregador

### 5.3 Entregador Responde

- Aceita dentro do tempo → status `ACEITA`, corrida atribuída, clientes e outros entregadores notificados
- Não responde / recusa → próximo da fila

### 5.4 Sem Entregador

- Todos recusaram ou não responderam → status `SEM_ENTREGADOR`
- Cliente pode tentar novamente ou cancelar

---

## 6. Execução da Entrega

| Etapa | Ação do Entregador | Status |
|---|---|---|
| 1 | Corrida aceita, segue para coleta | `A_CAMINHO_COLETA` |
| 2 | Clica "Cheguei" | `AGUARDANDO_COLETA` → inicia contagem de espera |
| 3 | Clica "Item Coletado" | `EM_ENTREGA` |
| 4 | Segue para destino | `EM_ENTREGA` (rastreamento ativo) |
| 5 | Insere código de confirmação do cliente | `FINALIZADA` |
| 6 | Cliente avalia + pagamento processado | Corrida encerrada |

> **Confirmação de entrega:** Usar código fornecido ao cliente em vez de botão simples — mais seguro contra fraudes.

---

## 7. Status da Corrida

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

## 8. Cálculo de Taxa

```
Total = Taxa Base + (Distância km × Valor por km)

Exemplo:
  Taxa base:    R$ 5,00
  Valor por km: R$ 2,50
  Distância:    8 km
  Total:        R$ 25,00
```

> ⚠️ **Ponto de atenção:** Os valores do exemplo resultam em custos altos para o consumidor (ex: 11km = R$32,50 sem taxa base). Revisar antes de ir para produção.

**Extensões futuras:**
- Taxa dinâmica (horário de pico)
- Multiplicador por demanda
- Taxa por tempo de espera
- Taxa por tipo de item

---

## 9. Fluxos Alternativos

### 9.1 Cliente Cancela Antes da Aceitação
- Status: `CANCELADA_PELO_CLIENTE`
- Entregadores que receberam a oferta são notificados

### 9.2 Entregador Cancela Após Aceitar
- Registrar penalidade (opcional, definir regra)
- Voltar para `PROCURANDO` ou cancelar corrida
- Notificar cliente

> ⚠️ **Ponto de revisão:** Lógica de penalidade e reentrada na fila precisa ser melhor definida.

### 9.3 Timeout — Entregador Não Responde
- 20 segundos sem resposta → próximo da fila
- Fila esgotada → status `SEM_ENTREGADOR`

### 9.4 Tempo de Espera na Coleta
- Entregador aguarda na coleta (ex: 10 min)
- Ultrapassou o tempo:
  - Cobrar taxa extra (opcional — definir sobre quem recai a cobrança)
  - Entregador pode continuar ou cancelar

> ⚠️ **Ponto de revisão:** Deixar claro nas regras de negócio quem arca com a taxa de espera e em quais condições.

### 9.5 Cancelamento Geral
- Pode ser feito por: cliente, entregador ou sistema
- Motivos comuns: endereço errado, cliente não atende, problema no item
- Notificar todas as partes envolvidas

---

## 10. Segurança

- JWT com refresh token
- Senhas com bcrypt
- Rate limiting nas APIs
- Validação de documentos (CNH, CPF, Placa)
- Logs de auditoria
- Backup automático do banco
