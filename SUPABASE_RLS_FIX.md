# 🔒 Correção de Row Level Security (RLS) - Supabase

## 📋 O Problema

O **Supabase Security Advisor** detectou que várias tabelas no schema `public` não têm Row Level Security (RLS) habilitado:

- ❌ `business_plans`
- ❌ `newsletter_subscribers`
- ❌ `subscriptions`
- ❌ `payments`

### Por que isso é crítico?

Sem RLS habilitado, **qualquer pessoa com acesso ao banco de dados pode ler, inserir, atualizar ou deletar dados** dessas tabelas, ignorando qualquer autenticação ou autorização.

## ✅ A Solução

Criamos uma migração completa que:

1. **Habilita RLS** em todas as tabelas públicas
2. **Remove políticas antigas** que possam estar conflitando
3. **Cria políticas de segurança adequadas** para cada tabela

### Arquivo de Migração

📁 `supabase/migrations/20251230000000_enable_rls_security.sql`

## 🚀 Como Aplicar a Correção

### Opção 1: Via Dashboard (RECOMENDADO)

```powershell
.\fix-supabase-rls.ps1
```

Escolha a opção **1** e siga as instruções.

Ou manualmente:

1. Acesse o [SQL Editor do Supabase](https://supabase.com/dashboard/project/rhkwickoweflamfigzeo/sql/new)
2. Copie o conteúdo de `supabase/migrations/20251230000000_enable_rls_security.sql`
3. Cole no editor e clique em **Run**

### Opção 2: Via Supabase CLI

```powershell
# Se tiver Supabase CLI instalado
supabase db push
```

### Opção 3: Comando SQL Direto

```sql
-- Execute no SQL Editor do Supabase
\i supabase/migrations/20251230000000_enable_rls_security.sql
```

## 🔐 Políticas de Segurança Criadas

### `business_plans`
- ✅ **Leitura pública**: Qualquer pessoa pode ver planos ativos
- 🔒 **Gerenciamento**: Apenas usuários autenticados (admin) podem criar/editar/deletar

### `newsletter_subscribers`
- ✅ **Inscrição pública**: Qualquer pessoa pode se inscrever
- 🔒 **Leitura/Gerenciamento**: Apenas usuários autenticados (admin)

### `subscriptions`
- 🔒 **Service Role**: Backend pode fazer tudo via `service_role` key
- 👤 **Usuários autenticados**: Podem ver apenas suas próprias assinaturas

### `payments`
- 🔒 **Service Role**: Backend pode fazer tudo via `service_role` key
- 👤 **Usuários autenticados**: Podem ver apenas seus próprios pagamentos

### `business_registrations`
- ✅ **Cadastro público**: Novos estabelecimentos podem se cadastrar
- 🔒 **Service Role**: Backend pode fazer tudo
- 👤 **Usuários autenticados**: Podem ver/editar apenas seus próprios registros

## ✅ Verificar se Funcionou

1. Acesse o [Security Advisor](https://supabase.com/dashboard/project/rhkwickoweflamfigzeo/advisors/security)
2. Clique em **"Rerun linter"** ou **"Refresh"**
3. Os erros devem desaparecer:
   - ✅ 0 errors
   - ✅ 0-3 warnings (aceitável)

## 🧪 Testar as Políticas

### Teste 1: Leitura pública de planos

```javascript
// Deve funcionar (sem autenticação)
const { data, error } = await supabase
  .from('business_plans')
  .select('*')
  .eq('is_active', true)
```

### Teste 2: Inscrição na newsletter

```javascript
// Deve funcionar (sem autenticação)
const { data, error } = await supabase
  .from('newsletter_subscribers')
  .insert({ email: 'teste@example.com' })
```

### Teste 3: Leitura de payments (deve falhar sem auth)

```javascript
// Deve falhar se não estiver autenticado com service_role
const { data, error } = await supabase
  .from('payments')
  .select('*')
// Retorna: [] ou erro de permissão
```

### Teste 4: Backend com service_role

```javascript
// No backend, usando SUPABASE_SERVICE_ROLE_KEY
const { data, error } = await supabaseAdmin
  .from('payments')
  .select('*')
// Deve funcionar e retornar todos os pagamentos
```

## 🔧 Configuração do Backend

Certifique-se de que seu backend está usando a **service_role key** do Supabase:

```javascript
// server/index.js ou similar
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY // ← IMPORTANTE!

export const supabase = createClient(supabaseUrl, supabaseServiceKey)
```

### Variáveis de Ambiente

```bash
# .env (backend)
SUPABASE_URL=https://rhkwickoweflamfigzeo.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc... # NÃO a anon key!
```

## 📚 Conceitos Importantes

### O que é RLS?

**Row Level Security** permite controlar quem pode acessar quais linhas em uma tabela baseado em:
- Status de autenticação (`auth.uid()`)
- Propriedade dos dados (`user_id = auth.uid()`)
- Roles (`auth.role()`)
- Lógica customizada

### Diferença entre `anon` e `service_role`

| Key | Uso | Acesso |
|-----|-----|--------|
| `anon` | Frontend, público | Respeita RLS |
| `service_role` | Backend, admin | Bypassa RLS |

**⚠️ NUNCA exponha a `service_role` key no frontend!**

## 🔄 Reverter (se necessário)

Se precisar reverter a migração:

```sql
-- CUIDADO: Isso desabilita toda a segurança!
ALTER TABLE public.business_plans DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_registrations DISABLE ROW LEVEL SECURITY;
```

## 📖 Referências

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL RLS](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [Supabase Security Best Practices](https://supabase.com/docs/guides/platform/going-into-prod)

## 🐛 Problemas Comuns

### "permission denied for table X"

**Causa**: RLS está bloqueando o acesso
**Solução**: Verifique se está usando a key correta (`service_role` no backend)

### "no policy with check option"

**Causa**: Tentando inserir dados sem política WITH CHECK
**Solução**: Revise as políticas de INSERT/UPDATE da tabela

### "infinite recursion detected"

**Causa**: Política recursiva (ex: SELECT que depende de outro SELECT)
**Solução**: Simplifique a lógica da política ou use security definer functions

---

**Última atualização**: 30/12/2025
**Status**: ✅ Pronto para aplicar
