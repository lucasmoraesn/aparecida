# 🧪 GUIA COMPLETO DE TESTES — AWS SES

## 📋 Overview

Você tem **3 scripts de teste** para diagnosticar e testar o envio de e-mails via AWS SES:

| Script | Comando | O que faz |
|--------|---------|-----------|
| **Diagnóstico** | `npm run diagnose:ses` | Verifica configuração AWS SES completa |
| **Teste Interativo** | `npm run test:ses` | Menu com 4 tipos de e-mail para testar |
| **Simular Pagamento** | `npm run test:payment <id>` | Simula webhook completo + e-mails |

---

## 🚀 PASSO 1: Diagnosticar a Configuração

**Sempre comece por isto!**

```bash
npm run diagnose:ses
```

Isso vai verificar:
- ✅ Variáveis de ambiente (AWS_REGION, EMAIL_FROM, ADMIN_EMAIL)
- ✅ Conexão com AWS
- ✅ Se SES está habilitado
- ✅ Endereços verificados
- ✅ Se está em Sandbox ou Produção

**Exemplo de output:**

```
╔═══════════════════════════════════════════════════════════════╗
║           🔍 DIAGNÓSTICO AWS SES - EXPLORE APARECIDA           ║
╚═══════════════════════════════════════════════════════════════╝

📋 PASSO 1: Variáveis de Ambiente
─────────────────────────────────────────────────────────
✅ AWS_REGION: us-east-2
✅ EMAIL_FROM: Explore Aparecida <noreply@aparecidadonortesp.com.br>
✅ ADMIN_EMAIL: aparecidatoursp@hotmail.com

📋 PASSO 2: Conectando ao AWS SES...
─────────────────────────────────────────────────────────
✅ Cliente SES criado para região: us-east-2

📋 PASSO 3: Verificando se SES está habilitado...
─────────────────────────────────────────────────────────
✅ SES Habilitado: SIM

📋 PASSO 4: Endereços verificados no SES
─────────────────────────────────────────────────────────
Total de endereços verificados: 1
   ✅ EMAIL_FROM noreply@aparecidadonortesp.com.br

📋 PASSO 5: Quota de envio (Sandbox ou Produção)
─────────────────────────────────────────────────────────
Max 24h emails     : 50000
Max rate (por seg)  : 14
Enviados nas 24h    : 12

✅ MODO PRODUÇÃO ATIVADO!
```

---

## 🧪 PASSO 2: Testar Envio de E-items

**Depois que o diagnóstico passar, faça o teste interativo:**

```bash
npm run test:ses
```

Você verá um menu:

```
Escolha um tipo de teste:

  1️⃣  E-mail de teste simples
  2️⃣  Notificação de nova assinatura (admin)
  3️⃣  Confirmação de assinatura (cliente)
  4️⃣  E-mail customizado
```

### Teste 1: E-mail Simples

```
Opcão (1-4): 1
📧 TESTE 1: E-MAIL DE TESTE SIMPLES

Seu e-mail de destino: seu@email.com
🚀 Enviando e-mail de teste...

✅ E-MAIL ENVIADO COM SUCESSO!

   MessageId: 0102019...
   Para: seu@email.com
   Remetente: Explore Aparecida <noreply@aparecidadonortesp.com.br>

💡 Verifique sua caixa de entrada (ou spam) em poucos segundos!
```

### Teste 2: Notificação Admin

```
Opcão (1-4): 2
📧 TESTE 2: NOTIFICAÇÃO DE NOVA ASSINATURA (ADMIN)

Nome do estabelecimento (padrão: "Pizza Express"): Meu Restaurante
E-mail do estabelecimento (padrão: "pizza@example.com"): contato@meurest.com.br
Nome do plano (padrão: "Plano Pro"): Plano Premium
Preço do plano (padrão: 29.90): 49.90

🚀 Enviando notificação ao admin...

✅ NOTIFICAÇÃO ENVIADA COM SUCESSO!

   MessageId: 0102019...
   Para: aparecidatoursp@hotmail.com
   Estabelecimento: Meu Restaurante
   Plano: Plano Premium

💡 Verifique o inbox do admin em poucos segundos!
```

### Teste 3: Confirmação Cliente

```
Opcão (1-4): 3
📧 TESTE 3: CONFIRMAÇÃO DE ASSINATURA (CLIENTE)

E-mail do cliente: cliente@example.com
Nome do estabelecimento (padrão: "Meu Restaurante"): Meu Negócio
Nome do plano (padrão: "Plano Básico"): Plano Ouro
Preço do plano (padrão: 19.90): 39.90

🚀 Enviando confirmação ao cliente...

✅ CONFIRMAÇÃO ENVIADA COM SUCESSO!
```

### Teste 4: E-mail Customizado

```
Opcão (1-4): 4
📧 TESTE 4: E-MAIL CUSTOMIZADO

E-mail de destino: teste@example.com
Assunto: Teste customizado
Corpo (texto simples): Olá! Este é um teste de e-mail customizado.

🚀 Enviando e-mail customizado...

✅ E-MAIL ENVIADO COM SUCESSO!
```

---

## 💳 PASSO 3: Simular Pagamento Completo

**Para testar o fluxo COMPLETO (webhook + e-mails):**

```bash
npm run test:payment <business_id>
```

Você precisa de um `business_id` válido. Para achar, rode:

```sql
SELECT id, establishment_name, contact_email FROM business_registrations LIMIT 5;
```

**Exemplo:**

```bash
npm run test:payment "550e8400-e29b-41d4-a716-446655440000"
```

**Output:**

```
╔═══════════════════════════════════════════════════════════════╗
║       🧪 SIMULAÇÃO DE PAGAMENTO - EXPLORE APARECIDA           ║
╚═══════════════════════════════════════════════════════════════╝

🔍 Buscando estabelecimento com ID: 550e8400-e29b-41d4-a716-446655440000

✅ Estabelecimento encontrado:
   Nome: Pizza Express
   E-mail: pizza@example.com
   WhatsApp: 11999999999

🔍 Buscando planos disponíveis...

✅ Planos disponíveis:
   1. Plano Básico - R$ 19.90
   2. Plano Pro - R$ 29.90
   3. Plano Premium - R$ 49.90

📦 Usando plano: Plano Básico (R$ 19.90)

📝 Criando assinatura simulada...

✅ Assinatura criada:
   ID: 123e4567-e89b-12d3-a456-426614174000
   Status: pending
   Checkout Session: cs_test_1708372800000

🔔 Simulando webhook checkout.session.completed...

✅ Assinatura ATIVADA!

📧 Enviando notificações por e-mail...

   1️⃣  E-mail ao ADMIN...
      ✅ Enviado (MessageId: 0102019...)

   2️⃣  E-mail ao CLIENTE...
      ✅ Enviado (MessageId: 0102020...)

═══════════════════════════════════════════════════════════════
✅ SIMULAÇÃO CONCLUÍDA COM SUCESSO!

Resumo do que foi feito:
  ✓ Criada assinatura para: Pizza Express
  ✓ Plano: Plano Básico (R$ 19.90)
  ✓ E-mail ao admin: aparecidatoursp@hotmail.com
  ✓ E-mail ao cliente: pizza@example.com

💡 Verifique os e-mails em poucos segundos!
```

---

## ❌ Problemas Comuns e Soluções

### ❌ "Cliente SES não criado" | "Error: UnrecognizedClientException"

**Causa:** Credenciais AWS não disponíveis

**Solução:**
- 🏠 **Em desenvolvimento local** (Windows/Mac):
  - Instale [AWS CLI](https://aws.amazon.com/cli/)
  - Configure: `aws configure`
  - Adicione Access Key e Secret Key
  
- 🚀 **Em produção (EC2)**:
  - IAM Role deve estar attachado à instância
  - Verifique permissões: `ses:SendEmail`, `ses:SendRawEmail`

### ❌ "Nenhum endereço verificado no SES"

**Causa:** Domínio ou e-mail não verificado no SES
 
**Solução:**
1. Acesse: https://us-east-2.console.aws.amazon.com/ses/
2. Clique em "Verified identities"
3. Clique em "Create identity"
4. Adicione: `noreply@aparecidadonortesp.com.br`
5. Confirm o link no seu e-mail

### ⚠️ "Sandbox Mode" (limit: ~200 e-mails/dia)

**Causa:** Conta AWS nova ou em fase de teste

**Solução:**
1. Vá para: https://us-east-2.console.aws.amazon.com/ses/
2. Dashboard → Production access
3. Clique em "Request production access"
4. Preencha o formulário (geralmente aprovado em 24h)

### ❌ E-mail não chega (vai para spam?)

**Dicas:**
- Verifique a pasta de spam/promotions
- Espere 30 segundos (SES pode estar enfileirando)
- Verifique os logs do servidor: `npm run dev`
- Teste com um e-mail pessoal diferente
- Remova o bloco de propagação se der erro de auth

### ❌ "STRIPE_WEBHOOK_SECRET não configurado" ao fazer pagamento

**Solução:** Adicione no `.env`:
```env
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## 📊 Fluxo Completo de Teste

```
1. npm run diagnose:ses
   └─ Verifica configuração AWS
   
2. npm run test:ses
   └─ Opção 1: teste simples
   └─ Opção 2: notificação admin
   └─ Opção 3: confirmação cliente
   └─ Opção 4: customizado
   
3. npm run test:payment <bus_id>
   └─ Simula webhook completo
   └─ Envia e-mail admin + cliente
   └─ Atualiza status no Supabase
```

---

## 📚 Arquivos Relacionados

- [diagnose-ses.js](../diagnose-ses.js) — Script de diagnóstico
- [test-ses-complete.js](../test-ses-complete.js) — Teste interativo
- [simulate-payment.js](../simulate-payment.js) — Simula pagamento
- [services/sesEmailService.js](../services/sesEmailService.js) — Serviço SES
- [.env](../.env) — Variáveis de ambiente

---

## 💬 Precisa de ajuda?

Se algo não funcionar:

1. Verifique os logs: `npm run dev` (deixe rodando)
2. Rode o diagnóstico: `npm run diagnose:ses`
3. Verifique a console AWS SES
4. Cole o erro completo aqui para análise

Boa sorte! 🍀
