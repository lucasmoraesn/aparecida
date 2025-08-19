# Sistema de Cadastro e Pagamento - Aparecida

## Funcionalidades Implementadas

✅ **Formulário de Cadastro Completo**
- Seleção de planos (Básico, Intermediário, Premium) com cards
- Upload de fotos (3-10 imagens)
- Validação de formulário
- Checkbox obrigatório para termos e política de privacidade

✅ **Sistema de Pagamento**
- Integração com Mercado Pago
- Pagamento via PIX
- Pagamento via Cartão de Crédito
- Verificação automática de status do pagamento

✅ **Banco de Dados**
- Tabelas para cadastros pendentes
- Tabelas para pagamentos
- Tabelas para planos de negócio
- Aprovação automática após confirmação do pagamento

✅ **Notificações**
- E-mail automático para administrador
- Status de pagamento em tempo real

## Configuração

### 1. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Supabase Configuration
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase

# Mercado Pago Configuration
VITE_MERCADO_PAGO_ACCESS_TOKEN=seu_access_token_do_mercadopago
VITE_MERCADO_PAGO_PUBLIC_KEY=sua_public_key_do_mercadopago

# Admin Email
VITE_ADMIN_EMAIL=admin@aparecida.com
```

### 2. Configuração do Mercado Pago

1. Acesse [Mercado Pago Developers](https://www.mercadopago.com.br/developers)
2. Crie uma conta ou faça login
3. Vá para "Suas integrações" > "Credenciais"
4. Copie o **Access Token** e **Public Key**
5. Configure as variáveis de ambiente

### 3. Configuração do Supabase

1. Execute as migrações do banco de dados:
```bash
npx supabase db push
```

2. Verifique se as tabelas foram criadas:
- `business_plans`
- `business_registrations`
- `payments`

### 4. Configuração de E-mail (Opcional)

Para enviar e-mails automáticos, você pode integrar com:

- **Resend**: `npm install resend`
- **SendGrid**: `npm install @sendgrid/mail`
- **Nodemailer**: `npm install nodemailer`

Edite o arquivo `src/lib/businessService.ts` na função `sendAdminEmail` para implementar o serviço de e-mail desejado.

## Fluxo do Sistema

### 1. Cadastro do Negócio
1. Usuário preenche o formulário
2. Seleciona um plano
3. Aceita os termos
4. Clica em "Finalizar Cadastro e Pagar"

### 2. Processamento
1. Dados são salvos no banco de dados
2. E-mail é enviado para o administrador
3. Usuário é redirecionado para página de pagamento

### 3. Pagamento
1. Usuário escolhe método (PIX ou Cartão)
2. Sistema gera pagamento no Mercado Pago
3. Para PIX: gera código QR e verifica status automaticamente
4. Para Cartão: processa imediatamente

### 4. Aprovação
1. Após confirmação do pagamento
2. Status é atualizado no banco
3. Cadastro fica pendente de aprovação manual
4. Administrador pode aprovar via painel

## Estrutura do Banco de Dados

### Tabela: business_plans
```sql
- id (SERIAL PRIMARY KEY)
- name (TEXT)
- price (DECIMAL)
- features (JSONB)
- is_active (BOOLEAN)
```

### Tabela: business_registrations
```sql
- id (SERIAL PRIMARY KEY)
- establishment_name (TEXT)
- category (TEXT)
- address (TEXT)
- location (TEXT)
- photos (JSONB)
- whatsapp (TEXT)
- phone (TEXT)
- description (TEXT)
- plan_id (INTEGER)
- status (TEXT) -- 'pending', 'approved', 'rejected'
- payment_status (TEXT) -- 'pending', 'paid', 'failed'
- admin_email (TEXT)
- contact_email (TEXT)
```

### Tabela: payments
```sql
- id (SERIAL PRIMARY KEY)
- registration_id (INTEGER)
- amount (DECIMAL)
- currency (TEXT)
- payment_method (TEXT)
- payment_provider (TEXT)
- provider_payment_id (TEXT)
- status (TEXT)
- pix_code (TEXT)
- pix_expires_at (TIMESTAMPTZ)
```

## Comandos Úteis

### Instalar dependências
```bash
npm install
```

### Executar migrações
```bash
npx supabase db push
```

### Desenvolver
```bash
npm run dev
```

### Build para produção
```bash
npm run build
```

## Personalização

### Alterar Planos
Edite a migração `20250809181104_business_registrations.sql` para modificar os planos padrão.

### Alterar E-mail do Administrador
Modifique a variável `VITE_ADMIN_EMAIL` no arquivo `.env`.

### Personalizar Validações
Edite a função `validateForm` em `src/pages/BusinessRegistration.tsx`.

### Personalizar Design
Modifique os componentes em `src/pages/` e `src/components/`.

## Suporte

Para dúvidas ou problemas:
1. Verifique os logs do console
2. Confirme se as variáveis de ambiente estão corretas
3. Teste a conexão com o Supabase
4. Verifique as credenciais do Mercado Pago

## Próximos Passos

- [ ] Implementar upload real de imagens
- [ ] Criar painel administrativo
- [ ] Adicionar webhooks do Mercado Pago
- [ ] Implementar notificações push
- [ ] Adicionar relatórios de pagamento
